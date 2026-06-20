import axios from "axios";
// import { applyTimestamps } from "../../../../../backend/src/models/blacklist.model";

// repetetive code ko ek variable me save karke us variable ko use kar sakte hain 

const api= axios.create({
    baseURL:"http://localhost:2000",
    withCredentials:true
})

export async function register({username, email, password}){

    try{
    const response= await api.post('/api/auth/register', {
        username, email ,password
    });

            return response.data;


}catch(error){
    console.log(error)

}
}

export async function login({ email, password}){

    try{
    const response= await api.post('/api/auth/login', {
        email ,password
    });

    return response.data;

}catch(error){
    console.log(error)
}
}

export async function logout(){
    try{

        const response= await api.get('/api/auth/logout',{
            
        })

        return response.data;

    }catch(error){
        console.log(error)
    }
}

export async function getMe(){
    try{
        const response = await api.get('/api/auth/get-me');
        return response.data;

    }catch(error){
        console.log(error)
        return null;
    }
}