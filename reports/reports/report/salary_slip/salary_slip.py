import frappe

def execute(filters=None):
    columns = get_columns(filters)
    data = get_data(filters)
    return columns, data

def get_columns(filters):
    columns = [
        {
            "label": "Employee",
            "fieldname": "employee",
            "fieldtype": "Link",
            "options": "Employee",
        },
        {
            "label": "Company",
            "fieldname": "company",
            "fieldtype": "Link",
            "options": "Company",
        },
        {
            "label": "Posting Date",
            "fieldname": "posting_date",
            "fieldtype": "Date",
        },
        {
            "label": "Working Days",
            "fieldname": "total_working_days",
            "fieldtype": "Data",
        },
        {
            "label": "Earnings",
            "fieldname": "earnings",
            "fieldtype": "Currency",
        },
        {
            "label": "Deductions",
            "fieldname": "deductions",
            "fieldtype": "Currency",
        },
    ]
    return columns

def get_data(filters):
    data = []
    emp_filters = {}
    
    if filters.get('employee'):
        emp_filters['employee'] = filters.get('employee')
    if filters.get('company'):
        emp_filters['company'] = filters.get('company')
    if filters.get('posting_date'):
        emp_filters['posting_date'] = filters.get('posting_date')
    if filters.get('total_working_days'):
        emp_filters['total_working_days'] = filters.get('total_working_days')
    
    salary_slips = frappe.get_list('Salary Slip', filters=emp_filters, fields=["*"])
    
    for slip in salary_slips:
        earnings_total = 0
        deductions_total = 0
        
        earnings = frappe.get_all('Salary Detail', filters={'parent': slip.name}, fields=['amount'])
        deductions = frappe.get_all('Salary Detail', filters={'parent': slip.name}, fields=['amount'])
        
        for earning in earnings:
            earnings_total += earning.amount
        for deduction in deductions:
            deductions_total += deduction.amount

        data.append({
            "employee": slip.employee,
            "company": slip.company,
            "posting_date": slip.posting_date,
            "total_working_days": slip.total_working_days,
            "earnings": earnings_total,
            "deductions": deductions_total,
        })

    return data
