import React, { useEffect, useState } from "react";
import {
View,
Text,
FlatList,
Image,
StyleSheet,
ActivityIndicator
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../constants/api";

export default function MyReports(){

const [reports,setReports] = useState([]);
const [loading,setLoading] = useState(true);

const loadReports = async ()=>{

try{

const token = await AsyncStorage.getItem("token");
const userData = await AsyncStorage.getItem("user");

const user = JSON.parse(userData);

const res = await fetch(`${API_URL}/incidents`,{
headers:{
Authorization:`Bearer ${token}`
}
});

const data = await res.json();

const myReports = data.filter(
(i)=> i.reported_by === user.id
);

setReports(myReports);

}catch(err){

console.log(err);

}finally{
setLoading(false);
}

};

useEffect(()=>{
loadReports();
},[]);

const renderItem = ({item})=>(
<View style={styles.card}>

<Image
source={{uri:`${API_URL}/uploads/${item.image_path}`}}
style={styles.image}
/>

<View style={styles.content}>

<Text style={styles.title}>
{item.detected_class?.replace("_"," ")}
</Text>

<Text style={styles.status}>
Status: {item.status || "Pending"}
</Text>

<Text style={styles.text}>
Department: {item.department || "Manager Review"}
</Text>

<Text style={styles.text}>
Location: {item.location_text || "Not provided"}
</Text>

<Text style={styles.time}>
{new Date(item.created_at).toLocaleString()}
</Text>

</View>

</View>
);

if(loading){
return(
<LinearGradient colors={["#5f3dc4","#3b2fa3"]} style={styles.center}>
<ActivityIndicator size="large" color="white"/>
</LinearGradient>
);
}

return(

<LinearGradient
colors={["#5f3dc4","#3b2fa3"]}
style={styles.container}
>

<Text style={styles.header}>
My Reported Incidents
</Text>

<FlatList
data={reports}
renderItem={renderItem}
keyExtractor={(i)=>i.id.toString()}
contentContainerStyle={{paddingBottom:30}}
/>

</LinearGradient>

);

}

const styles = StyleSheet.create({

container:{
flex:1,
paddingTop:60,
paddingHorizontal:15
},

center:{
flex:1,
justifyContent:"center",
alignItems:"center"
},

header:{
fontSize:26,
fontWeight:"bold",
color:"white",
marginBottom:20,
textAlign:"center"
},

card:{
backgroundColor:"rgba(255,255,255,0.12)",
borderRadius:20,
marginBottom:15,
overflow:"hidden"
},

image:{
width:"100%",
height:160
},

content:{
padding:15
},

title:{
fontSize:20,
fontWeight:"bold",
color:"white",
marginBottom:6,
textTransform:"capitalize"
},

status:{
color:"#4ADE80",
fontWeight:"600",
marginBottom:4
},

text:{
color:"white",
marginBottom:3
},

time:{
color:"#D1D5DB",
marginTop:6,
fontSize:12
}

});