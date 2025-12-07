/**
 * Product Description Result Component
 *
 * @description Display component for AI-generated product descriptions.
 * Shows short description, long description, bullet points, and SEO keywords.
 *
 * @module ui/product-description-result
 */

import { Card } from './card'
import { Badge } from './badge'
import { Button } from './button'
import type { ProductDescriptionResult } from '../../../apps/web/types/product-description'

interface ProductDescriptionResultProps {
  data: ProductDescriptionResult
  onCopy?: (text: string) => void
  onRegenerate?: () => void
  className?: string
}

/**
 * Result display component for generated product descriptions
 *
 * @param {ProductDescriptionResultProps} props - Component props
 * @returns {JSX.Element} Result display component
 *
 * @example
 * <ProductDescriptionResult
 *   data={generatedDescription}
 *   onCopy={(text) => navigator.clipboard.writeText(text)}
 *   onRegenerate={() => regenerate()}
 * />
 */
export function ProductDescriptionResult({
  data,
  onCopy,
  onRegenerate,
  className = '',
}: ProductDescriptionResultProps): React.JSX.Element {
  const handleCopy = async (text: string): Promise<void> => {
    if (onCopy !== null && onCopy !== undefined) {
      onCopy(text)
    } else {
      await navigator.clipboard.writeText(text)
    }
  }

  const handleCopyClick = (text: string): void => {
    void handleCopy(text)
  }

  const copyAll = (): void => {
    const allText = [
      `**${data.short}**`,
      '',
      data.long,
      '',
      'Fitur Utama:',
      ...data.bullets.map((bullet: string) => `- ${bullet}`),
      '',
      `Kata Kunci SEO: ${data.seoKeywords.join(', ')}`,
    ].join('\n')

    void handleCopy(allText)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Short Description */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Deskripsi Singkat
            </h4>
            <p className="text-lg font-semibold text-foreground">{data.short}</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleCopyClick(data.short)}
            className="ml-4"
          >
            Salin
          </Button>
        </div>
      </Card>

      {/* Long Description */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Deskripsi Lengkap
            </h4>
            <p className="text-foreground leading-relaxed">{data.long}</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleCopyClick(data.long)}
            className="ml-4"
          >
            Salin
          </Button>
        </div>
      </Card>

      {/* Bullets */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Fitur Utama
            </h4>
            <ul className="space-y-2">
              {data.bullets.map((bullet: string) => (
                <li key={bullet} className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span className="text-foreground">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleCopyClick(data.bullets.map((b: string) => `- ${b}`).join('\n'))}
            className="ml-4"
          >
            Salin
          </Button>
        </div>
      </Card>

      {/* SEO Keywords */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Kata Kunci SEO
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.seoKeywords.map((keyword: string) => (
                <Badge key={keyword} color="blue">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleCopyClick(data.seoKeywords.join(', '))}
            className="ml-4"
          >
            Salin
          </Button>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={copyAll} className="flex-1">
          Salin Semua
        </Button>
        {onRegenerate !== null && onRegenerate !== undefined && (
          <Button variant="secondary" onClick={onRegenerate}>
            Generate Ulang
          </Button>
        )}
      </div>
    </div>
  )
}
