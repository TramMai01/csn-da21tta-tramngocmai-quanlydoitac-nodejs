document.getElementById('deleteBtn').addEventListener('click', function() {
  if (confirm('Bạn có chắc chắn muốn xóa đối tác này không?')) {
    // Extract partner ID from the button's data attribute
    var partnerId = this.getAttribute('data-partner-id');

    // Construct the URL with the partner ID
    var deleteUrl = '/api/partners/' + encodeURIComponent(partnerId);

    // Make the DELETE request
    fetch(deleteUrl, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Đối tác đã được xóa.');
        window.location.href = "/partners/manage";
      } else {
        alert('Xóa đối tác thất bại.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Đã xảy ra lỗi khi xóa đối tác.');
    });
  }
});
