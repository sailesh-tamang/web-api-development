import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '@/app/component/ui/input';

describe('Input Component', () => {
  it('renders input element', () => {
    render(<Input label="Test" />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('accepts type prop', () => {
    render(<Input type="email" label="Email" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.type).toBe('email');
  });

  it('accepts placeholder prop', () => {
    render(<Input placeholder="Enter email" label="Email" />);
    const input = screen.getByPlaceholderText('Enter email');
    expect(input).toBeInTheDocument();
  });

  it('handles onChange event', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    
    render(<Input onChange={handleChange} label="Test" />);
    const input = screen.getByRole('textbox');
    
    await user.type(input, 'test value');
    expect(handleChange).toHaveBeenCalled();
  });

  it('accepts and displays value prop', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Input value="initial" readOnly label="Test" />);
    
    let input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('initial');
    
    rerender(<Input value="updated" readOnly label="Test" />);
    input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('updated');
  });

  it('renders disabled input', () => {
    render(<Input disabled label="Disabled" />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('applies custom className', () => {
    const { container } = render(<Input className="custom-class" label="Test" />);
    const input = container.querySelector('input');
    expect(input).toHaveClass('custom-class');
  });

  it('accepts different input types', () => {
    const { container, rerender } = render(<Input type="password" label="Password" />);
    let input = container.querySelector('input') as HTMLInputElement;
    expect(input.type).toBe('password');

    rerender(<Input type="number" label="Number" />);
    input = container.querySelector('input') as HTMLInputElement;
    expect(input.type).toBe('number');
  });

  it('handles focus and blur events', async () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    const user = userEvent.setup();
    
    render(<Input onFocus={handleFocus} onBlur={handleBlur} label="Test" />);
    const input = screen.getByRole('textbox');
    
    await user.click(input);
    expect(handleFocus).toHaveBeenCalled();
    
    await user.click(document.body);
    expect(handleBlur).toHaveBeenCalled();
  });
});
