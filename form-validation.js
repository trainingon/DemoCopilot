// Form validation object
const FormValidator = {
  // Validation rules
  rules: {
    username: {
      required: true,
      minLength: 3,
      maxLength: 20,
      pattern: /^[a-zA-Z0-9_]+$/,
      errorMessage: 'Username must be 3-20 characters and contain only letters, numbers, and underscores'
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      errorMessage: 'Please enter a valid email address'
    },
    password: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
      errorMessage: 'Password must be at least 8 characters with uppercase, number, and special character'
    },
    confirmPassword: {
      required: true,
      matchField: 'password',
      errorMessage: 'Passwords do not match'
    },
    phone: {
      required: false,
      pattern: /^[0-9]{10}$/,
      errorMessage: 'Phone number must be 10 digits'
    },
    terms: {
      required: true,
      errorMessage: 'You must agree to the terms and conditions'
    }
  },

  // Validate individual field
  validateField(fieldName, value) {
    const rule = this.rules[fieldName];
    if (!rule) return { valid: true, error: '' };

    // Check if required
    if (rule.required && (!value || value.trim() === '')) {
      return { valid: false, error: `${this.formatFieldName(fieldName)} is required` };
    }

    // If not required and empty, it's valid
    if (!rule.required && (!value || value.trim() === '')) {
      return { valid: true, error: '' };
    }

    // Check minimum length
    if (rule.minLength && value.length < rule.minLength) {
      return { valid: false, error: rule.errorMessage };
    }

    // Check maximum length
    if (rule.maxLength && value.length > rule.maxLength) {
      return { valid: false, error: rule.errorMessage };
    }

    // Check pattern
    if (rule.pattern && !rule.pattern.test(value)) {
      return { valid: false, error: rule.errorMessage };
    }

    // Check if field matches another field (for password confirmation)
    if (rule.matchField) {
      const matchFieldValue = document.getElementById(rule.matchField).value;
      if (value !== matchFieldValue) {
        return { valid: false, error: rule.errorMessage };
      }
    }

    return { valid: true, error: '' };
  },

  // Format field name for display
  formatFieldName(fieldName) {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  },

  // Display error message
  displayError(fieldName, error) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    const inputElement = document.getElementById(fieldName);

    if (errorElement) {
      errorElement.textContent = error;
    }

    if (inputElement) {
      if (error) {
        inputElement.classList.add('invalid');
        inputElement.classList.remove('valid');
      } else {
        inputElement.classList.remove('invalid');
        inputElement.classList.add('valid');
      }
    }
  },

  // Validate all fields
  validateForm() {
    let isFormValid = true;
    const form = document.getElementById('validationForm');
    const fields = Object.keys(this.rules);

    fields.forEach(fieldName => {
      let value;
      const element = document.getElementById(fieldName);

      if (element.type === 'checkbox') {
        value = element.checked ? 'checked' : '';
      } else {
        value = element.value;
      }

      const validation = this.validateField(fieldName, value);
      this.displayError(fieldName, validation.error);

      if (!validation.valid) {
        isFormValid = false;
      }
    });

    return isFormValid;
  },

  // Initialize form validation
  init() {
    const form = document.getElementById('validationForm');
    const fields = Object.keys(this.rules);

    // Add real-time validation
    fields.forEach(fieldName => {
      const element = document.getElementById(fieldName);
      if (element) {
        element.addEventListener('blur', () => {
          let value;
          if (element.type === 'checkbox') {
            value = element.checked ? 'checked' : '';
          } else {
            value = element.value;
          }
          const validation = this.validateField(fieldName, value);
          this.displayError(fieldName, validation.error);
        });

        // Clear error on focus
        element.addEventListener('focus', () => {
          this.displayError(fieldName, '');
        });

        // Real-time validation for password confirmation
        if (fieldName === 'password' || fieldName === 'confirmPassword') {
          element.addEventListener('input', () => {
            const confirmPasswordElement = document.getElementById('confirmPassword');
            if (confirmPasswordElement && confirmPasswordElement.value) {
              const validation = this.validateField('confirmPassword', confirmPasswordElement.value);
              this.displayError('confirmPassword', validation.error);
            }
          });
        }
      }
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (this.validateForm()) {
        this.submitForm();
      }
    });
  },

  // Handle form submission
  submitForm() {
    const form = document.getElementById('validationForm');
    const successMessage = document.getElementById('successMessage');

    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    console.log('Form submitted with data:', data);

    // Display success message
    successMessage.style.display = 'block';

    // Reset form
    form.reset();

    // Clear all error messages
    Object.keys(this.rules).forEach(fieldName => {
      this.displayError(fieldName, '');
      const element = document.getElementById(fieldName);
      if (element) {
        element.classList.remove('valid', 'invalid');
      }
    });

    // Hide success message after 4 seconds
    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 4000);
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  FormValidator.init();
});
