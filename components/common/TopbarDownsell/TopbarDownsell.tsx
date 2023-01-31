import { FC } from 'react'
import { Container } from '@components/ui'

const TopbarDownsell: FC = () => (
  <>
    <Container>
      <div className="relative flex flex-row justify-between py-4 align-center md:py-6">
        <div className="flex items-center justify-between flex-1">
          <div>
            <p className="text-3xl font-bold">
              Like The Design? - <span className="text-pink">Save 40%</span>
            </p>
          </div>

          <div>
            <p className="text-xl italic">
              Show Joe Biden and the dirty democrats that you believe in the 2nd
              amendment with this shirt
            </p>
          </div>
        </div>
      </div>
    </Container>

    <div className="relative" style={{ backgroundColor: '#0139a3' }}>
      <p className="py-1 text-center text-white text-xl font-bold">
        WAIT! YOUR ORDER IS NOT YET COMPLETE
      </p>
    </div>
  </>
)

export default TopbarDownsell
