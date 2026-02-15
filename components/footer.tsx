import Link from "next/link"
import { Instagram, Mail } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            {/* <Link href="/" className="font-serif text-2xl tracking-wide mb-4 block">
              La Ruche Studio
            </Link> */}
            <Image src="/images/logo-noBg.png" alt="La Ruche Studio" width={100} height={100} />
            <p className="text-primary-foreground/80 leading-relaxed max-w-md mb-6">
              Rejoignez la Ruche — une communauté créative où chaque atelier est une
              expérience unique, un moment de pause et un souvenir à emporter.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/la_ruche_studio/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              {/* <a
                href="mailto:hello@larouchestudio.com"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a> */}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4">Navigation</h4>
            <nav className="space-y-3">
              <Link
                href="#ateliers"
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Nos Ateliers
              </Link>
              <Link
                href="#pause-art"
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                La Pause d'Art
              </Link>
              <Link
                href="#entreprises"
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Entreprises
              </Link>
              <Link
                href="#blog"
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Blog
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-medium mb-4">Contact</h4>
            <address className="not-italic text-primary-foreground/80 space-y-3">
              <p>hello@larouchestudio.com</p>              
              <p>Casablanca, Maroc</p>
            </address>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            © 2026 La Ruche Studio. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6 text-sm text-primary-foreground/60">
            <Link href="#" className="hover:text-primary-foreground transition-colors">
              Mentions légales
            </Link>
            <Link href="#" className="hover:text-primary-foreground transition-colors">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
