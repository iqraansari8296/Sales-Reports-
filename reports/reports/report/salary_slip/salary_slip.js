// Copyright (c) 2024, izzu.com and contributors
// For license information, please see license.txt

frappe.query_reports["Salary Slip"] = {
    onload: function (report) {
        var defaultEmployee = frappe.defaults.get_default("employee");
        
        frappe.db.get_list('Salary Slip', {
            fields: ['name'],
            filters: { 'employee': defaultEmployee },
            limit: 6,
        }).then(salarySlips => {
            if (salarySlips.length > 0) {
                let salarySlip = salarySlips[0];
                
                frappe.db.get_doc('Salary Slip', salarySlip.name)
                    .then(doc => {
                        let earningsAmount = 0;
                        let deductionsAmount = 0;

                        // Get the first amount from earnings child table
                        if (doc.earnings && doc.earnings.length > 0) {
                            earningsAmount = doc.earnings[0].amount;
                        }

                        // Get the first amount from deductions child table
                        if (doc.deductions && doc.deductions.length > 0) {
                            deductionsAmount = doc.deductions[0].amount;
                        }

                        localStorage.setItem("employee", JSON.stringify({ 
                            employee: doc.employee,
                            company: doc.company,
                            posting_date: doc.posting_date,
                            total_working_days: doc.total_working_days,
                            amount: earningsAmount,
                            amount: deductionsAmount,
                        }));
                    });
            }
        });
    },


    
    

    "filters": [
        {
                "label": "Employee",
                "fieldname": "employee",
                "fieldtype": "Link",
                "options": "Employee",
                // "width" : 800,
            },
            {
                "label": "Company",
                "fieldname": "company",
                "fieldtype": "Link",
                "options": "Company",
                // "width" : 800
    
            },
            {
                "label": "Posting Date",
                "fieldname": "posting_date",
                "fieldtype": "Date",
                // "width" : 800
    
            },
            {
                "label": "Working Days",
                "fieldname": "total_working_days",
                "fieldtype": "Data",
                // "width" : 200
    
            },
            {
                "label": "Earnings",
                "fieldname": "earnings",
                "fieldtype": "Currency",
                // "width" : 800
    
            },
            {
                "label": "Deductions",
                "fieldname": "deductions",
                "fieldtype": "Currency",
                // "width" : 800
    
            },
    
        ]
};