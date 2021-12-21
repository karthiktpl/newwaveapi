const User = (sequelize, Sequelize) =>{
    const user = sequelize.define("users", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING
        },
        role: {
            type: Sequelize.ENUM('SUPERADMIN', 'ADMIN', 'USER')
        },
        last_login: {
            type: Sequelize.DATE
        },
        status: {
            type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
            defaultValue : 'ACTIVE'
        }    
    },
    {
        timestamps: 1
    });
    return user;
}

module.exports = User;
