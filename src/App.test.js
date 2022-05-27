import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const typeIntoForm = ({ email, password, confirmPassword }) => {
  const emailInputElement = screen.getByRole('textbox', {
    name: /email/i
  });
  const passwordInputElement = screen.getByLabelText('Password');
  const confirmPasswordInputElement = screen.getByLabelText(/confirm password/i);
  if (email) {
    userEvent.type(emailInputElement, email);
  } 
  if (password) {
    userEvent.type(passwordInputElement, password);
  }
  if (confirmPassword) {
    userEvent.type(confirmPasswordInputElement, confirmPassword);
  }

  return {
    emailInputElement,
    passwordInputElement,
    confirmPasswordInputElement
  }
};

const clickOnSubmitButton = () => {
  const submitBtnElement = screen.getByRole('button', {
    name: /submit/i
  });
  userEvent.click(submitBtnElement)
}

describe('App', () => {
  test('inputs should be initially empty', () => {
    render(<App />)
  
    expect(screen.getByRole('textbox').value).toBe('');
    expect(screen.getByLabelText('Password').value).toBe('');
    expect(screen.getByLabelText(/confirm password/i).value).toBe('');
  })
  
  test('should be able to type an email', () => {
    render(<App />)
    const { emailInputElement } = typeIntoForm({ email: 'daria@gmail.com' });
    expect(emailInputElement.value).toBe('daria@gmail.com');
  })
  
  test('should be able to type a password', () => {
    render(<App />)
    const { passwordInputElement } = typeIntoForm({ password: 'password123' });
    expect(passwordInputElement.value).toBe('password123');
  
  })
  
  test('should be able to type a confirm password', () => {
    render(<App />)
    const { confirmPasswordInputElement } = typeIntoForm({ confirmPassword: 'password123' });
    expect(confirmPasswordInputElement.value).toBe('password123');
  })

  describe('Error Handling', () => {
    test('should show email error message on invalid email', () => {
      render(<App />)
    
      const emailErrorElement = screen.queryByText(/the email you input is invalid/i)
    
      expect(emailErrorElement).not.toBeInTheDocument();
    
      typeIntoForm({ email: 'dariagmail.com' });
      clickOnSubmitButton();
    
      expect(screen.queryByText(
        /the email you input is invalid/i
      )).toBeInTheDocument();
    })
    
    test('should show password error message if password is less than 5 characters', () => {
      render(<App />)
    
      typeIntoForm({ email: 'daria@gmail.com' })
    
      expect(screen.queryByText(
        /the password you entered should contain 5 or more characters/i
      )).not.toBeInTheDocument();
    
      typeIntoForm({ password: '123' })
    
      clickOnSubmitButton();
    
      expect(screen.queryByText(
        /the password you entered should contain 5 or more characters/i
      )).toBeInTheDocument();
    })
    
    test("should show confirm password error message if passwords don't match", () => {
      render(<App />)
    
      typeIntoForm({
        email: 'daria@gmail.com',
        password: '12345'
      });
    
      expect(screen.queryByText(
        /the passwords you entered should match/i
      )).not.toBeInTheDocument();
    
      typeIntoForm({
        confirmPassword: '123456'
      });
    
      clickOnSubmitButton();
    
      expect(screen.queryByText(
        /the passwords you entered should match/i
      )).toBeInTheDocument();
    })
    
    test("should show no error message if every input is valid", () => {
      render(<App />)
    
      typeIntoForm({
        email: 'daria@gmail.com',
        password: '12345',
        confirmPassword: '12345'
      });
      clickOnSubmitButton();
    
      expect(screen.queryByText(
        /the email you input is invalid/i
      )).not.toBeInTheDocument();
      expect(screen.queryByText(
        /the password you entered should contain 5 or more characters/i
      )).not.toBeInTheDocument();
      expect(screen.queryByText(
        /the passwords you entered should match/i
      )).not.toBeInTheDocument();
    })
  })
});