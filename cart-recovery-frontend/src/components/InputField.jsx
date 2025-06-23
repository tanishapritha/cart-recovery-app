function InputField({ label, name, value, onChange, type = "text" }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label>
        {label}
        <br />
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          style={{ padding: '8px', width: '100%' }}
        />
      </label>
    </div>
  );
}

export default InputField;
