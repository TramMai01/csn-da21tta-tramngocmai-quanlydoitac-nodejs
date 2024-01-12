document.addEventListener('DOMContentLoaded', function () {
  var individualForm = document.getElementById('individualForm');
  var organizationForm = document.getElementById('organizationForm');
  var partnerTypeSelection = document.getElementById('partnerType');

  function toggleFormVisibility() {
    individualForm.style.display = partnerTypeSelection.value === 'individual' ? 'block' : 'none';
    organizationForm.style.display = partnerTypeSelection.value === 'organization' ? 'block' : 'none';
  }

  function submitForm(apiEndpoint) {
    var form = partnerTypeSelection.value === 'individual' ? individualForm : organizationForm;
    var formData = new FormData(form);

    var fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...Object.fromEntries(formData),
        partnerType: partnerTypeSelection.value,
      }),
    };

    fetch(apiEndpoint, fetchOptions)
      .then(response => response.json())
      .then(data => {
        console.log('Server response:', data);

        if (data.error) {
          alert('Error: ' + data.error);
        } else {
          alert('Thêm đối tác thành công!');
          window.location.href = 'http://localhost:9999/partners/manage';
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });

    return false;
  }

  partnerTypeSelection.addEventListener('change', toggleFormVisibility);

  toggleFormVisibility();

  individualForm.onsubmit = function () {
    return submitForm('/api/partners');
  };

  organizationForm.onsubmit = function () {
    return submitForm('/api/partners');
  };
});
