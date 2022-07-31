var db=require('../config/connection')
var collection=require('../config/collection')
var bcrypt=require('bcrypt')
const { response } = require('../app')
var objectId=require('mongodb').ObjectId
module.exports={

    AdminaddUser:(userData)=>{
        return new Promise(async(resolve,reject)=>{

            let user=await db.get().collection(collection.USER_COLLECTION).findOne({username:userData.username})
            let islogstatus=false
            if(user){
    
                resolve(islogstatus)
                
            }else{
    
            islogstatus=true
            userData.password=await bcrypt.hash(userData.password,10 )
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                console.log(data);
               resolve(islogstatus)
            }) 
        }
    
        })
      
    },
    getAllUsers:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let userdisplay=await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(userdisplay)
        })

    },
    deleteUser:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).remove({_id:objectId(userId)}).then((response)=>{
                resolve(response)
            })
        })
    },
    getuserdetails:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(userId)}).then((result)=>{
                resolve(result)
            })
        })
    },



    //update user



    updateUser:(userId,usrdetails)=>{
        return new Promise(async(resolve,reject)=>{
            if(usrdetails.username && usrdetails.email && usrdetails.name){
                let islogstatus=true
            
         await   db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(userId)},{
            $set:{
                username:usrdetails.username,
                name:usrdetails.name,
                
                email:usrdetails.email

            }
         }).then((result)=>{
                resolve(islogstatus)

            })
        }else{
            islogstatus=false
            resolve(islogstatus)
        }
        })
    },
    //adminId is the data send in the form by the user 
    
       
    adminLogin:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
           let loginStatus=false
           let response={}
            let user=await db.get().collection(collection.ADMIN_COLLECTION).findOne({username:adminData.username})
            if(user){
                bcrypt.compare(adminData.password,user.password).then((status)=>{
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