const cds = require('@sap/cds');


module.exports = (srv) => {
    const { Students } = srv.entities;

    //Check if Roll no. <=0
    srv.before(['CREATE', 'UPDATE'], Students, (req) => {
        if (req.data.rollno <= 0) {
            req.error(400, 'Roll number must be greater than 0');
        }
    });

    //Keeping the Roll no. unique (can be done in the datamodel too)
    srv.on('CREATE', Students, async (req, next) => {
        const exists = await SELECT.one.from(Students).where({ rollno: req.data.rollno });
        if (exists) {
            req.reject(400, `Roll number ${req.data.rollno} already exists.`);
        }
        return next();
    });

    // Using after hook for custom display
    srv.after('READ', Students, (each) => {
        if (each.rollno < 10) {
            each.name = `${each.name} (Junior)`;
        }
    });

    // Set Roll no. to 1 for the given Student ID
    srv.on('resetRollNoTo1', async (req) => {
        const { ID } = req.data;
        const student = await SELECT.one.from(Students).where({ ID });
        if (!student) req.reject(404, 'Student not found');

        await UPDATE(Students).set({ rollno: 1 }).where({ ID });
        return await SELECT.one.from(Students).where({ ID });
    });

    // No. of Students with same name
    srv.on('getStudentsCountWithGivenName', async (req) => {
        const { name } = req.data;

        if (name) {
            const count = await cds.run(`SELECT COUNT(*) AS COUNT FROM DATA_STUDENTS WHERE NAME = '${name}'`);
            return `Total students with name '${name}': ${count[0].COUNT}`;
        }

        return 'Pass a parameter like: getStudentsCountWithGivenName(name=NameRequired)';
    });

    // Generic handler with no entity
    srv.before('READ', (req) => {
        if (req)
            console.log(`📘 Reading from ${req.target.name}`);
    });
}
