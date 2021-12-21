const School = (sequelize, Sequelize) =>{
    const school = sequelize.define("schools", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        alias: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        address: {
            type: Sequelize.TEXT
        },
        email: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
        fax: {
            type: Sequelize.STRING
        },
        folder_path: {
            type: Sequelize.STRING
        },
        created_by: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
            defaultValue : 'ACTIVE'
        } 
    },
    {
        timestamps: 1
    });
    return school;
}

module.exports = School;