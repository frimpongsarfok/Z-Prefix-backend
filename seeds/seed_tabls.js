const bcrypt=require('bcrypt');
const saltRounds = 10;
/**
 * 
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */



exports.seed = async function(knex) {
   let password=undefined;
  bcrypt.hash('12345678', saltRounds, function(err, hash) {
    err?console.log(err):password=hash;
  });
  // Deletes ALL existing entries
  await knex('post').del()
  await knex('users').del();
  await knex('users').insert([
    {fname:'Sarfo',lname:'Frimpong',email:'frimpongsarfok@gmail.com',username:'frimpongsarfok',password:password},
  ]);
  await knex('post').insert([
    {username:'frimpongsarfok',title:`Ye, aka Kanye West, is banned from performing at the Grammys`,
      content:`Ye, the artist formerly known as Kanye West, has been barred from performing at the 2022 Grammy Awards due to his "concerning online behavior," according to a spokesperson for the controversial artist.`,
      },
  ]);
};

