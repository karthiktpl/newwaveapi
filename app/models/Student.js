const Student = (sequelize, Sequelize) =>{
    const student = sequelize.define("students", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        school_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'schools',
                key: 'id'
            }            
        },
        division_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'divisions',
                key: 'id'
            }            
        },
        first_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        middle_name: {
            type: Sequelize.STRING,
        },
        last_name: {
            type: Sequelize.STRING,
        },
        phone: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
        },
        address: {
            type: Sequelize.TEXT,
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
    return division;
}

module.exports = Divsion;
