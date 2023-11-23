const path = require('path');
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const app = express();
const port = 3939;

app.use(express.static(path.join(__dirname,'public')));
// HTTP
app.use(morgan('combined'));
app.use('/path/to/css', express.static('public', { type: 'text/css' }));

// Template engine
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'resources','views'));



// Route cho trang thêm đối tác
app.get('/add-partner', (req, res) => {
  res.render('them', { page: 'add-partner' });
});

// Route cho trang sửa đối tác
app.get('/edit-partner', (req, res) => {
  res.render('capnhat', { page: 'edit-partner' });
});

// Route cho trang thêm hoạt động
app.get('/add-activity', (req, res) => {
  res.render('hoatdong', { page: 'add-activity' });
});

app.listen(port, () => console.log(`Example app listening on port ${port}`));
