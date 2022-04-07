/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
 return knex.schema.createTable('users',table=>{
      table.bigIncrements('id');
      table.string('fname');
      table.string('lname');
      table.string('email');
      table.string('username').unique();
      table.string('password').unique();
      table.binary('displayImage')
  })
  .createTable('post',table=>{
      table.bigIncrements('id');
      table.string('username').notNullable;
      table.text('title').notNullable;
      table.text('content').notNullable;
      table.binary('media')
      table.timestamps(true,true);
      table.foreign('username')
        .references('username')
        .inTable('users')
        .onDelete('cascade')
        .onUpdate('cascade');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return  knex.schema.dropTableIfExists('post').dropTableIfExists('users')
   
};
