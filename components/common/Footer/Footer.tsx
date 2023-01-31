import { FC } from 'react'
import cn from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { Page } from '@framework/common/get-all-pages'
import getSlug from '@lib/get-slug'
import { Github, Vercel } from '@components/icons'
import { Logo, Container } from '@components/ui'
import { I18nWidget } from '@components/common'
import s from './Footer.module.css'

interface Props {
  className?: string
  children?: any
  pages?: Page[]
}

const LEGAL_PAGES = ['terms-of-use', 'shipping-returns', 'privacy-policy']

const Footer: FC<Props> = ({ className, pages }) => {
  const { sitePages, legalPages } = usePages(pages)
  const rootClassName = cn(className)

  return (
    <footer className={rootClassName}>
      <Container>
        <div className="mx-auto max-w-6xl pt-5 pb-3 text-center">
          <Logo />

          <div className="col-span-1 lg:col-span-2 mt-3">
            <ul className="flex flex-center justify-center flex-col md:flex-row md:flex-1">
              <li className="py-3 md:py-0 md:pb-4 px-2">
                <Link href="https://libertyapparel.com/pages/terms-of-service">
                  <a
                    className="text-primary hover:text-accents-6 transition ease-in-out duration-150 underline"
                    target="_blank"
                  >
                    TERMS & CONDITIONS
                  </a>
                </Link>
              </li>
              <li className="py-3 md:py-0 md:pb-4 px-2">
                <Link href="https://libertyapparel.com/pages/privacy-policy">
                  <a
                    className="text-primary hover:text-accents-6 transition ease-in-out duration-150 underline"
                    target="_blank"
                  >
                    PRIVACY POLICY
                  </a>
                </Link>
              </li>
              <li className="py-3 md:py-0 md:pb-4 px-2">
                <Link href="https://libertyapparel.com/pages/refund-policy">
                  <a
                    className="text-primary hover:text-accents-6 transition ease-in-out duration-150 underline"
                    target="_blank"
                  >
                    REFUND POLICY
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center w-full">
            <p className="mb-3">
              We are an independent private company that believes in keeping
              America great. This site is not a part of the Facebook website or
              Facebook Inc nor is it part of Google or Google Inc. Additionally,
              This site is NOT endorsed by Facebook or Google in any way.
              FACEBOOK is a trademark of FACEBOOK, Inc. GOOGLE is a trademark of
              GOOGLE Inc
            </p>

            <small className="text-gray-500">
              © 2021 by Liberty Apparel, LLC. All Rights Reserved.
            </small>
          </div>
        </div>
      </Container>

      {/* Revcontent */}
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N7TMGPG"
          height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `var _at = {}; window._at.track = window._at.track || function(){(window._at.track.q = window._at.track.q || []).push(arguments);}; _at.domain = 'libertyapparel.com';_at.owner = '41399d71adab';_at.idSite = '23708';_at.attributes = {};_at.webpushid = 'web.2.aimtell.com';(function() { var u='//s3.amazonaws.com/cdn.aimtell.com/trackpush/'; var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0]; g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'trackpush.min.js'; s.parentNode.insertBefore(g,s); })();`,
        }}
      />
    </footer>
  )
}

function usePages(pages?: Page[]) {
  const { locale } = useRouter()
  const sitePages: Page[] = []
  const legalPages: Page[] = []

  if (pages) {
    pages.forEach((page) => {
      const slug = page.url && getSlug(page.url)

      if (!slug) return
      if (locale && !slug.startsWith(`${locale}/`)) return

      if (isLegalPage(slug, locale)) {
        legalPages.push(page)
      } else {
        sitePages.push(page)
      }
    })
  }

  return {
    sitePages: sitePages.sort(bySortOrder),
    legalPages: legalPages.sort(bySortOrder),
  }
}

const isLegalPage = (slug: string, locale?: string) =>
  locale
    ? LEGAL_PAGES.some((p) => `${locale}/${p}` === slug)
    : LEGAL_PAGES.includes(slug)

// Sort pages by the sort order assigned in the BC dashboard
function bySortOrder(a: Page, b: Page) {
  return (a.sort_order ?? 0) - (b.sort_order ?? 0)
}

export default Footer
