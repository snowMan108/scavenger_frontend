const Button = ({ src, children, className, onClick }) => {
  return (
    <div onClick={onClick} className="relative flex cursor-pointer flex-col">
      <img src={src} alt="" />
      <div className={`absolute h-full w-full ${className}`}>{children}</div>
    </div>
  )
}

export default Button
