const FormInput = ({ label, field, type, value, setValue, errors, onBlur }) => (
  <div className="form-group">
    <label>{label}</label>
    <div className="danger alert-danger">
      <ul className="my-0">
        {errors &&
          errors.map((err) =>
            err.field === field ? (
              <li key={err.message}>{err.message}</li>
            ) : null
          )}
      </ul>
    </div>
    <input
      value={value}
      type={type}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      className="form-control"
    />
  </div>
);

export default FormInput;
