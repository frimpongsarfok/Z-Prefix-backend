var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

const saltRounds = 10;
const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV || 'production']);
const request = require('request');
const multer  = require('multer');
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


// await because user login is needed before other transaction will be proceed
  const login=(username,password)=>{

  //get username
  //if found compare password 
  //   if password match response status 200
  //   else resp status  404 msg incorrect password
  //else username not found respond 
//      404 msg username not exist
  //

  return new Promise((resolve,reject)=>{
    
   if(!username||!password){

    return reject({status:401,msg:'username and password required'});
   }else{
    return  knex('users').where({username:username}).then(rows=>{
      console.log('username ',username,"password",password, rows[0])
        if(rows.length){
          if(!rows[0].password){
            reject({status:404,msg:'password incorrect'})
            return;
          }
        
          bcrypt.compare(password, rows[0].password)
          .then((result)=>{
            const user={...rows[0]}
            console.log(result);
            user.password=password;
            user.displayImage?
            user.displayImage=`data:image/png;base64,${new Buffer.from(user.displayImage).toString("base64")}`:undefined;
            result? resolve(user):reject({status:404,msg:'password incorrect'})        
         })
        }else{
            return reject({status:404,msg:"user name not found"})
        }

      })
   }
  });

}

//LOGOUT
router.get('/logout', function(req, res, next) {
   
  res.setHeader('Set-Cookie', [
    `username=; SameSite=None; Secure`,
    `password=; SameSite=None; Secure`,
  ])
  .status(200).json({status:200,msg:'logout successful'})
   
});



///LOGIN
router.get('/login', function(req, res, next) {
  const {username,password}=req.query;
   login(username,password).then(user=>{
     
    res.setHeader('Set-Cookie', [
      `username=${user.username}; SameSite=None; Secure`,
      `password=${user.password}; SameSite=None; Secure`,
    ]).status(200).json(user);
   }).catch(err=>res.status(404).json(err.detail?{status:401,msg:err.detail}:err))
  
});
  
      //res.status(200).json({status:200,msg:'successful'})
  //     :
  //     res.status(200).json({status:200,msg:'username or password incorrect'});
  
// });

// //SIGN UP USER
// //salt&hash password before stored in db
router.post('/signup', function(req, res, next) {
  const {fname,lname,email,username,password}=req.body;

  if(!fname||!lname||!email||!username||!password){
      res.status(401).json({status:401,msg:'All fields required (firt name,last name,email,username,password)'})
      return;
  }

  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      const  query={...req.body};
      query.password=hash;
      knex('users').insert(query)
      .then(rows=>{
      query.password=password;  
      res.status(200)
       .setHeader('Set-Cookie', [
          `username=${user.username}; SameSite=None; Secure`,
          `password=${user.password}; SameSite=None; Secure`,
        ])
      .json(query)
    })
      .catch(err=>res.status(401).json({status:401,msg:err.detail}));
    });
  });
})
router.get('/user', function(req, res, next) {
 
  const {username}=req.query;     
  if(!username){
      res.status(401).json({status:401,msg:'username required'})
      return;
  }
    knex('users').where({username:username})
    .then(rows=>{
      console.log(rows,username)
      if(rows.length){
        const user={
          credential:{username:rows[0].username},
          lname:rows[0].lname,
          fname:rows[0].fname,
          email:rows[0].email,
          displayImage:rows[0].displayImage?
                             `data:image/png;base64,${new Buffer.from(rows[0].displayImage).toString("base64")}`:undefined
        }
        res.status(201)
        .json(user)
      }else{
        res.status(201)
        .json({status:404,msg:'user not found'})
      }
      
  }) .catch(err=>res.status(401).json({status:401,msg:err.detail}));
})
//
router.put('/user', upload.single('displayImage'),function(req, res, next) {
  const {username,password}=req.cookies;
  if(!username||!password){
    res.status(404).json({status:404,msg:'login required'})
    return;
  }
  const {fname,lname,email,new_username,new_password}=req.body;     
  if(!fname&&!lname&&!email&&!new_username&&!new_password){
      res.status(401).json({status:401,msg:'one of the field required (firt name,last name,email,username,password)'})
      return;
  }
    let query={
      fname:fname,
      lname:lname,
      email:email,
      username:new_username,
      password:new_password,
      displayImage:req.file?req.file.buffer:undefined,
     }
    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(new_password, salt, function(err, hash) {
        query.password=hash;
        knex('users').update(query).where({username:username})
        .then(rows=>res.status(200)
        .setHeader('Set-Cookie', [
           `username=${user.username}; SameSite=None; Secure`,
           `password=${user.password}; SameSite=None; Secure`,
         ])
        .json({status:200,msg:'profile updated successful'}))
        .catch(err=>res.status(401).json({status:401,msg:err.detail}));
      });
    })
  
})

//     id:4,
//     user:{
//         fname:'Jekea',
//         lname:'White',
//         username:'whitejekea'
//     },
    
//     title:'Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10 minutes.',
//     content:`Heat oil in a (14- to 16-inch) paella pan or a large, 
//             deep skillet over medium-high heat. Add chicken, shrimp and chorizo, and cook, 
//             stirring occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a 
//             large plate and set aside, leaving chicken and chorizo in the pan. Add pimentón, 
//             bay leaves, garlic, tomatoes, onion, salt and pepper, and cook, stirring often until thickened and 
//             fragrant, about 10 minutes. Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.`,
//     media:{},
//     date:"September 14, 2016"



// GET 50 POST CONTENT AT A TIME
//if USER ID PROVIDED SELECT UP USER POST 
router.get('/post', function(req, res, next) {

  const {username,password}=req.cookies;
const {mypost}=req.query;
 if(mypost==='true'){
  console.log('hieie',typeof mypost)
  if(!username||!password){
    res.status(404).json({status:404,msg:'login required'})
    return;
  } knex('post').where({username:username}).orderBy('created_at','desc')
  .then(posts=>{
    
   let userPostJSON=[];
    if(!posts.length){
      res.status(200).json(userPostJSON);
    return;
   }
   posts.forEach( async(post,idx) => {
      await   knex('users').where({username:post.username})
        .then(user=>{
      
          userPostJSON.push({
            id:post.id,
            user:{
              fname:user[0].fname,
              lname:user[0].lname,
              username:user[0].username

            },
             title:post.title,
             content:post.content,
             media:{
               src:post.media?`data:image/png;base64,${new Buffer.from(post.media).toString("base64")}`:undefined,
               name:user[0].fname},
             date:post.created_at

          });
          if((idx+1)>=posts.length){
            res.status(200).json(userPostJSON);
          }
        }).catch(err=>res.status(404).json({status:401,msg:err.detail}));
   
   });

}).catch(err=>res.status(404).json({status:401,msg:err}))


 }else{
  knex('post').orderBy('created_at','desc')
  .then(posts=>{
  
   let userPostJSON=[];
    if(!posts.length){
      res.status(200).json(userPostJSON);
    return;
   }
   posts.forEach( async(post,idx) => {
      await   knex('users').where({username:post.username})
        .then(user=>{
      
          userPostJSON.push({
            id:post.id,
            user:{
              fname:user[0].fname,
              lname:user[0].lname,
              username:user[0].username

            },
             title:post.title,
             content:post.content,
             media:{
               src:post.media?`data:image/png;base64,${new Buffer.from(post.media).toString("base64")}`:undefined,
               name:user[0].fname},
             date:post.created_at

          });
          if((idx+1)>=posts.length){
            res.status(200).json(userPostJSON);
          }
        }).catch(err=>res.status(404).json({status:401,msg:err}));
   
   });

}).catch(err=>res.status(404).json({status:401,msg:err}))

 }

  
}); 

router.get('/search',(req,res)=>{
    const {value}=req.query;
    if(!value){
    
      res.status(200).json([]);
      return;
    }
    knex.raw(`
        SELECT users.fname,users.lname,users.username,post.title,post.media,post.id
    FROM  users
    JOIN post 
    ON (users.username=post.username)
    WHERE users.fname LIKE '%${value}%'
    OR   users.lname  LIKE '%${value}%'
    OR   users.email LIKE '%${value}%'
    OR   users.username  LIKE '%${value}%'
    OR   post.title  LIKE '%${value}%'
    OR   post.content LIKE '%${value}%'
    `).then(msg=>res.status(200).json(msg.rows.map(ele=>{
       const post={...ele};
       console.log(post.media?true:false)
       post.media=post.media?`data:image/png;base64,${new Buffer.from(post.media).toString("base64")}`:undefined
       return post;
    })))
    .catch(err=>res.status(401).json({status:401,msg:err.detail}));
});



router.post('/post', upload.single('media'),function(req, res, next) {

  const {username,password}=req.cookies;
  if(!username||!password){
    res.status(404).json({status:404,msg:'login required'})
    return;
  }
  const {title,content}=req.body;
  if(!title || !content){
    res.status(401).json({status:401,msg:'field required (e.i title,content) ,optional media eg. picture'})
    return;
}
  const query={
    username:username,
    title:req.body.title,
    content:req.body.content,
    media:req.file?req.file.buffer:undefined
  }

  knex('post').insert(query)
    .then(rows=>res.status(200).json({status:200,msg:'posted successfully'}))
    .catch(err=>res.status(401).json({status:401,msg:err.detail}));
});

// UPDATE POST WITH PUT METHOD
router.put('/post', upload.single('media'),function(req, res, next) {
  
  const {username,password}=req.cookies;
  if(!username||!password){
    res.status(404).json({msg:'login required'})
    return;
  }
  const {post_id,title,content,media}=req.body;
  if(!post_id&&!title&&!content){
      res.status(401).json({status:40,msg:'field required (e.i title,content) ,optional media'})
      return;
  }
  const query={...req.body};
  const id=query.post_id;
  delete query.post_id;
  query.media=req.file?req.file.buffer:undefined;
  

  knex('post').update(query).where({username:username,id:id})
      .then(status=>res.status(201).json({status:200,msg:'updated successful'}))
      .catch(err=>console.log(err))//res.status(201).json({status:401,msg:err.detail}));

});


// // UPDATE POST WITH PATCH METHOD
// router.patch('/post', function(req, res, next) {
//   console.log(req.query);
//   const {username,password}=req.cookies;
//   if(!username||!password){
//     res.status(404).json({status:404,msg:'login required'})
//     return;
//   }
//   const {post_id,title,content,media}=req.query;
//   if(!post_id &&!title&&!content && !media){
//     res.status(401).json({status:401,msg:'field required (e.i title or content or media) ,optional media'})
//     return;
//  }
//  const query={...req.query};
//  const id=query.post_id;
//  delete query.post_id;
//   if(title){
  
//     knex('post').where({username:username,id:id}).update(query)
//         .then(rows=>res.status(201).json({msg:'updated successful'}))
//         .catch(res.status(201).json({status:401,msg:err.detail}));
//   }
//   if(content){
//     knex('post').where({username:username,id:id}).update(query)
//         .then(rows=>res.status(201).json({msg:'updated successful'}))
//         .catch(res.status(201).json({status:401,msg:err.detail}));
//   }
//   if(media){
//     knex('post').where({username:username,id:id}).update(query)
//     .then(rows=>res.status(201).json({msg:'updated successful'}))
//     .catch(res.status(201).json({status:401,msg:err.detail}));
//   }

// });
//DELETE POST
router.delete('/post', function(req, res, next) {
  console.log(req.query);
  const {username,password}=req.cookies;
  if(!username||!password){
    res.status(404).json({status:404,msg:'login required'})
    return;
  }
  const {post_id}=req.query;
  if(!post_id){
    res.status(401).json({status:401,msg:'post id required  '})
    return;
}
  knex('post').where({username:username,id:post_id}).del()
    .then(rows=>res.status(200).json({msg:'post deleted successful'}))
    .catch(err=>res.status(401).json({status:401,msg:err.detail}));
});
module.exports = router;
