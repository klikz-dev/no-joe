import Image from 'next/image'

const Logo = ({ className = '', ...props }) => (
  <Image
    className="w-full h-auto max-h-full object-contain"
    src={'/LA_Horizontal-Color.png'}
    alt={'Logo'}
    width={250}
    height={67}
    quality="85"
    {...props}
  />
)

export default Logo
