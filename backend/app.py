# ================= IMPORTS =================
from ultralytics import YOLO
import os
import random
from datetime import datetime
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_mail import Mail, Message
from dotenv import load_dotenv
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
import psutil
from sqlalchemy import text
from flask_cors import CORS
from flask_socketio import SocketIO, emit

# ================= ENV =================
load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
REPORT_FOLDER = os.path.join(BASE_DIR, "reports")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(REPORT_FOLDER, exist_ok=True)

# ================= APP =================
app = Flask(__name__)
CORS(app, supports_credentials=True)

# SOCKET.IO INITIALIZATION
socketio = SocketIO(app, cors_allowed_origins="*")
OTP_STORE = {}  # email -> otp

# ================= CONFIG =================
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(BASE_DIR, "yantraguard.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

app.config["MAIL_SERVER"] = os.getenv("MAIL_SERVER")
app.config["MAIL_PORT"] = int(os.getenv("MAIL_PORT", 587))
app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")
app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_DEFAULT_SENDER"] = os.getenv("MAIL_DEFAULT_SENDER")

MANAGER_EMAIL = os.getenv("MANAGER_EMAIL")

# ================= EXTENSIONS =================
db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
mail = Mail(app)

# ================= SOCKET EVENTS =================
@socketio.on("connect")
def handle_connect():
    print("Client connected")

@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected")

# ================= YOLO MODEL =================
YOLO_MODEL = YOLO(os.getenv("YOLO_MODEL_PATH"))
print("YOLO Model Loaded")

# ================= MODELS =================
class Department(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True)
    email = db.Column(db.String(200))


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    email = db.Column(db.String(200), unique=True)
    password_hash = db.Column(db.String(300))
    role = db.Column(db.String(50))
    department_id = db.Column(db.Integer, db.ForeignKey("department.id"))
    department = db.relationship("Department")

    def set_password(self, pw):
        self.password_hash = generate_password_hash(pw)

    def check_password(self, pw):
        return check_password_hash(self.password_hash, pw)


class Incident(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.Text)
    image_path = db.Column(db.String(300))
    detected_class = db.Column(db.String(100))
    location_text = db.Column(db.String(200))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)

    department_id = db.Column(db.Integer, db.ForeignKey("department.id"))
    reported_by = db.Column(db.Integer, db.ForeignKey("user.id"))

    created_at = db.Column(db.DateTime, default=datetime.now)
    status = db.Column(db.String(50), default="Pending")

    department = db.relationship("Department")
    reporter = db.relationship("User")

# ================= CLASS → DEPARTMENT =================
CLASS_TO_DEPARTMENT = {
    "fire": "Fire and Safety",
    "smoke": "Fire and Safety",
    "chemical_hazard": "Fire and Safety",
    "water_leak": "Fire and Safety",
    "no_helmet": "Fire and Safety",
    "worker_without_ppe": "Fire and Safety",
    "collapsed_worker": "Medical",
    "machinery": "Mechanical",
    "vehicle": "Mechanical",
    "electrical_spark": "Electrical",
    "unknown": None
}

# ================= SEED DEPARTMENTS =================
def seed_departments():

    depts = [
        ("Fire and Safety", "firesafetydepart@gmail.com"),
        ("Mechanical", "replymechanicaldepart@gmail.com"),
        ("Electrical", "speakelectricaldepart@gmail.com"),
        ("Medical", "reachmedicaldepart@gmail.com"),
    ]

    for name, email in depts:

        d = Department.query.filter_by(name=name).first()

        if not d:
            db.session.add(
                Department(name=name, email=email)
            )
        else:
            d.email = email

    db.session.commit()

# ================= PDF GENERATION =================
def generate_incident_pdf(incident):

    pdf_filename = f"incident_{incident.id}.pdf"
    pdf_path = os.path.join(REPORT_FOLDER, pdf_filename)

    c = canvas.Canvas(pdf_path, pagesize=A4)

    y = 800
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, y, "YantraGuard Incident Report")

    y -= 40
    c.setFont("Helvetica", 12)

    c.drawString(50, y, f"Incident ID: {incident.id}")
    y -= 25

    c.drawString(50, y, f"Class: {incident.detected_class}")
    y -= 25

    c.drawString(50, y, f"Description: {incident.description}")
    y -= 25

    c.drawString(50, y, f"Location: {incident.location_text}")
    y -= 25

    c.drawString(50, y, f"Latitude: {incident.latitude}")
    y -= 25

    c.drawString(50, y, f"Longitude: {incident.longitude}")
    y -= 25

    c.drawString(50, y, f"Time: {incident.created_at}")
    y -= 40

    image_path = os.path.join(UPLOAD_FOLDER, incident.image_path)

    if os.path.exists(image_path):
        c.drawImage(image_path, 50, y-250, width=400, height=250)

    c.save()
    return pdf_path

# ================= EMAIL =================
def notify_department(dept, incident, pdf_path):

    recipients = [dept.email] if dept else [MANAGER_EMAIL]

    msg = Message(
        subject=f"🚨 Incident Alert: {incident.detected_class}",
        recipients=recipients
    )

    msg.body = f"""
Incident ID: {incident.id}
Class: {incident.detected_class}
Description: {incident.description}
Location: {incident.location_text}
Time: {incident.created_at}
"""

    with open(pdf_path, "rb") as f:
        msg.attach(
            filename=os.path.basename(pdf_path),
            content_type="application/pdf",
            data=f.read()
        )

    mail.send(msg)

# ================= REGISTER =================
@app.route("/auth/register", methods=["POST"])
def register():

    data = request.get_json(silent=True) or request.form

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "employee")
    department_name = data.get("department")

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "Email already exists"}), 409

    dept = None

    if role in ["technician", "medical_staff"]:
        dept = Department.query.filter_by(name=department_name).first()

        if not dept:
            return jsonify({"error": "Department not found"}), 404

    user = User(
        name=name,
        email=email,
        role=role,
        department=dept
    )

    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "User registered successfully"})

# ================= LOGIN =================
@app.route("/auth/login", methods=["POST"])
def login():

    data = request.get_json(silent=True) or request.form

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"msg": "Invalid email or password"}), 401

    token = create_access_token(identity=str(user.id))

    return jsonify({
        "access_token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "department": user.department.name if user.department else None
        }
    })

# ================== FORGOT PASSWORD =================================

@app.route("/auth/forgot-password", methods=["POST"])
def forgot_password():

    data = request.get_json()
    email = data.get("email", "").strip().lower()

    user = User.query.filter(
        User.email.ilike(email)
    ).first()

    if not user:
        return jsonify({"msg": "Email not registered"}), 404

    # generate OTP
    otp = str(random.randint(100000, 999999))

    # store OTP
    OTP_STORE[email] = otp

    try:
        msg = Message(
            subject="YantraGuard Password Reset OTP",
            recipients=[email]
        )

        msg.body = f"""
Your OTP for password reset is: {otp}

Do not share this OTP with anyone.
"""

        mail.send(msg)

        return jsonify({"msg": "OTP sent successfully"})

    except Exception as e:
        print("MAIL ERROR:", e)
        return jsonify({"msg": "Failed to send email"}), 500
    
#================ RESET-PASSWORD=================================
@app.route("/auth/reset-password", methods=["POST"])
def reset_password():

    data = request.get_json()

    email = data.get("email", "").strip().lower()
    otp = str(data.get("otp")).strip()
    new_password = data.get("password")

    print(" Email:", email)
    print(" Entered OTP:", otp)
    print(" Stored OTP:", OTP_STORE.get(email))

    # ✅ check OTP
    if OTP_STORE.get(email) != otp:
        return jsonify({"msg": "Invalid OTP"}), 400

    user = User.query.filter(
        User.email.ilike(email)
    ).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    user.set_password(new_password)
    db.session.commit()

    # remove OTP after success
    OTP_STORE.pop(email, None)

    return jsonify({"msg": "Password reset successful"})    



# ================= INCIDENT UPLOAD =================
@app.route("/incidents/upload", methods=["POST"])
@jwt_required()
def upload_incident():

    user = User.query.get(int(get_jwt_identity()))

    image = request.files["image"]
    filename = f"{datetime.now().timestamp()}_{secure_filename(image.filename)}"

    file_path = os.path.join(UPLOAD_FOLDER, filename)
    image.save(file_path)

    results = YOLO_MODEL(file_path)
    detected_class = "unknown"

    if results and len(results) > 0:
        boxes = results[0].boxes

        if boxes and len(boxes.cls) > 0:
            class_id = int(boxes.cls[0])
            detected_class = YOLO_MODEL.names[class_id]

    detected_class = detected_class.lower().replace(" ", "_")

    dept_name = CLASS_TO_DEPARTMENT.get(detected_class)
    dept = Department.query.filter_by(name=dept_name).first() if dept_name else None

    incident = Incident(
        description=request.form.get("description"),
        image_path=filename,
        detected_class=detected_class,
        department=dept,
        reporter=user,
        location_text=request.form.get("location"),
        latitude=request.form.get("latitude"),
        longitude=request.form.get("longitude")
    )

    db.session.add(incident)
    db.session.commit()

    # REAL-TIME NOTIFICATION
    print("🚨 Emitting new_incident event")
    socketio.emit(
        "new_incident",
        {
            "id": incident.id,
            "class": incident.detected_class,
            "location": incident.location_text,
            "department": dept.name if dept else "Manager Review",
            "time": incident.created_at.isoformat()
        }
    )

    pdf_path = generate_incident_pdf(incident)
    notify_department(dept, incident, pdf_path)

    return jsonify({"msg": "Incident uploaded"})

# ================= GET INCIDENTS =================
@app.route("/incidents", methods=["GET"])
@jwt_required()
def get_incidents():

    incidents = Incident.query.order_by(Incident.created_at.desc()).all()

    return jsonify([{
        "id": i.id,
        "description": i.description,
        "detected_class": i.detected_class,
        "status": i.status,
        "location_text": i.location_text,
        "image_path": i.image_path,
        "department": i.department.name if i.department else "Manager Review",
        "reported_by": i.reported_by,
        "created_at": i.created_at.isoformat()
    } for i in incidents])


# ================= GET SINGLE INCIDENT =================

@app.route("/incidents/<int:id>", methods=["GET"])
@jwt_required()
def get_incident(id):

    incident = Incident.query.get_or_404(id)

    return jsonify({
        "id": incident.id,
        "description": incident.description,
        "detected_class": incident.detected_class,
        "status": incident.status,
        "location_text": incident.location_text,
        "image_path": incident.image_path,
        "department": incident.department.name if incident.department else "Manager Review",
        "reported_by": incident.reported_by,
        "created_at": incident.created_at.isoformat()
    })    

# ================= UPDATE STATUS =================
@app.route("/incidents/<int:id>/status", methods=["PUT"])
@jwt_required()
def update_status(id):

    user = User.query.get(int(get_jwt_identity()))

    if user.role not in ["technician","medical_staff","manager"]:
        return jsonify({"error":"Access denied"}),403

    incident = Incident.query.get_or_404(id)

    data = request.get_json()
    incident.status = data.get("status")

    db.session.commit()

    # REAL-TIME STATUS UPDATE
    socketio.emit(
        "incident_status_update",
        {
            "id": incident.id,
            "status": incident.status
        }
    )

    return jsonify({"msg":"Status updated"})


#============ Assign to the department ================
@app.route("/incidents/<int:id>/assign", methods=["PUT"])
@jwt_required()
def assign_incident(id):

    user = User.query.get(int(get_jwt_identity()))

    if user.role != "manager":
        return jsonify({"error": "Only manager can assign"}), 403

    incident = Incident.query.get_or_404(id)

    data = request.get_json()
    dept_name = data.get("department")

    dept = Department.query.filter_by(name=dept_name).first()

    if not dept:
        return jsonify({"error": "Department not found"}), 404

    incident.department = dept
    incident.status = "Acknowledged"

    db.session.commit()

    socketio.emit(
        "incident_status_update",
        {
            "id": incident.id,
            "status": incident.status,
            "department": dept.name
        }
    )

    return jsonify({"msg": "Incident assigned"})

# ================= GET USERS =================
@app.route("/users", methods=["GET"])
@jwt_required()
def get_users():

    user = User.query.get(int(get_jwt_identity()))

    # only admin can view users
    if user.role != "admin":
        return jsonify({"error": "Access denied"}), 403

    users = User.query.all()

    return jsonify([
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "department": u.department.name if u.department else None
        }
        for u in users
    ])   

# ================= UPDATE USER =================
@app.route("/users/<int:id>", methods=["PUT"])
@jwt_required()
def update_user(id):

    admin = User.query.get(int(get_jwt_identity()))

    # only admin can update users
    if admin.role != "admin":
        return jsonify({"error": "Access denied"}), 403

    user = User.query.get_or_404(id)

    data = request.get_json()

    role = data.get("role")
    department_name = data.get("department")

    if role:
        user.role = role

    if department_name:
        dept = Department.query.filter_by(name=department_name).first()
        if dept:
            user.department = dept

    db.session.commit()

    return jsonify({"msg": "User updated"}) 

# ================= DELETE USER =================
@app.route("/users/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_user(id):

    admin = User.query.get(int(get_jwt_identity()))

    # only admin can delete users
    if admin.role != "admin":
        return jsonify({"error": "Access denied"}), 403

    user = User.query.get_or_404(id)

    # prevent deleting admin itself
    if user.role == "admin":
        return jsonify({"error": "Cannot delete admin"}), 400

    db.session.delete(user)
    db.session.commit()

    return jsonify({"msg": "User deleted"})


# ================= SYSTEM STATUS =================
# ================= SYSTEM STATUS =================
@app.route("/system-status", methods=["GET"])
def system_status():

    try:
        cpu_usage = psutil.cpu_percent(interval=1)
        memory_usage = psutil.virtual_memory().percent
        disk_usage = psutil.disk_usage("/").percent

        # check database
        db.session.execute(text("SELECT 1"))

        return jsonify({
            "backend": "Running",
            "database": "Connected",
            "cpu_usage": cpu_usage,
            "memory_usage": memory_usage,
            "disk_usage": disk_usage,
            "server_time": datetime.now().isoformat()
        })

    except Exception as e:

        return jsonify({
            "backend": "Running",
            "database": "Disconnected",
            "error": str(e),
            "server_time": datetime.now().isoformat()
        }), 500
            

# ================= FILE SERVE =================
@app.route("/uploads/<filename>")
def serve_upload(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route("/reports/<filename>")
def serve_report(filename):
    return send_from_directory(REPORT_FOLDER, filename)

#========================= SEED =======================
def seed_admin():

    admin = User.query.filter_by(role="admin").first()

    if not admin:

        admin = User(
            name="System Admin",
            email="admin@yantraguard.com",
            role="admin"
        )

        admin.set_password("admin123")

        db.session.add(admin)
        db.session.commit()

def seed_manager():

    manager = User.query.filter_by(role="manager").first()

    if not manager:

        manager = User(
            name="System Manager",
            email=MANAGER_EMAIL,
            role="manager"
        )

        manager.set_password(os.getenv("MANAGER_PASSWORD"))

        db.session.add(manager)
        db.session.commit()        

# ================= INIT =================
def init_app():
    with app.app_context():
        db.create_all()
        seed_departments()
        seed_admin()
        seed_manager()
        system_status()


if __name__ == "__main__":
    init_app()
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)