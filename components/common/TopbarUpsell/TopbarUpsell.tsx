import { FC } from 'react'
import { Container } from '@components/ui'

const TopbarUpsell: FC = () => (
  <>
    <Container>
      <div className="relative flex flex-row justify-between py-4 align-center md:py-6">
        <div className="flex items-center justify-between flex-col md:flex-row md:flex-1">
          <div className="w-full mb-2 md:mb-0">
            <p className="text-xl md:text-3xl font-bold text-left">
              Like The Design? - <span className="text-pink">Save $10</span>
            </p>
          </div>

          <div>
            <p className="md:text-xl italic">
              Show Joe Biden and the dirty democrats that you believe in the 2nd
              amendment with this shirt
            </p>
          </div>
        </div>
      </div>
    </Container>
  </>
)

export default TopbarUpsell
