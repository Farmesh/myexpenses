import Expense from '../Models/Expense.js';
import XLSX from 'xlsx';
import moment from 'moment';

export const exportExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;
    let query = { user: req.user._id };

    // Add category filter if provided
    if (category && category !== 'All') {
      query.category = category;
    }

    // Add date range filter if provided
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const expenses = await Expense.find(query).sort({ date: -1 });

    // Transform data for Excel
    const workbookData = expenses.map(expense => ({
      Description: expense.description,
      Amount: expense.amount,
      Category: expense.category,
      Date: moment(expense.date).format('YYYY-MM-DD'),
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(workbookData);

    // Add column widths
    const colWidths = [
      { wch: 30 }, // Description
      { wch: 10 }, // Amount
      { wch: 15 }, // Category
      { wch: 12 }, // Date
    ];
    worksheet['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Expenses_${moment().format('YYYY-MM-DD')}.xlsx`);
    
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 