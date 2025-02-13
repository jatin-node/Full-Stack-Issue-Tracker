import React from 'react'

const InputBox = ({type, placeholder, id, value, inputClassname, className, name, autoComplete, disabled, onChange}) => {
  return (
    <div className="relative w-full">
      <input
        type={type}
        placeholder={placeholder}
        id={id}
        name={name}
        onChange={onChange}
        autoComplete={autoComplete}
        disabled={disabled}
        defaultValue={value}
        className={` border-b-[1px] outline-none border-zinc-500 w-full pl-10 py-2 ${inputClassname}`}
      />
      <i className={`absolute left-2 top-3 ${className}`}></i>
    </div>
  )
}

export default InputBox
