var db=require('../config/connection')
var collection=require('../config/collection')
const bcrypt=require('bcrypt')
module.exports={

addUser:(userData)=>{
    return new Promise(async(resolve,reject)=>{
        
        let user=await db.get().collection(collection.USER_COLLECTION).findOne({username:userData.username})
        let islogstatus=false
        if(user ){

            resolve(islogstatus)
            
        }else {

        islogstatus=true
        userData.password=await bcrypt.hash(userData.password,10 )
        db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
            console.log(data);
           resolve(islogstatus)
        }) 
    }

    })
  
},
doLogin:(userData)=>{
    return new Promise(async(resolve,reject)=>{
       let loginStatus=false
       let response={}
        let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
        if(user ){
            bcrypt.compare(userData.password,user.password).then((status)=>{
                if(status){
                    console.log('login success');
                    response.user=user
                    response.status=true
                    resolve(response)
                }else{
                  console.log('login failed'); 
                  resolve({status:false}) 
                }
            })

        }else{
            console.log('login failed');
            resolve({status:false}) 
        }
        

    })
}

}