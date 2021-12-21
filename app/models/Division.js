const Divsion = (sequelize, Sequelize) =>{
    const division = sequelize.define("divisions", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        school_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'schools',
                key: 'id'
            }            
        },
        image: {
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
    return division;
}

module.exports = Divsion;
