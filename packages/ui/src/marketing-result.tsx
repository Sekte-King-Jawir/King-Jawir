/**
 * Marketing Content Result Component
 *
 * @description Display component for AI-generated marketing content.
 * Shows platform-specific content, hashtags, and call-to-action.
 *
 * @module ui/marketing-result
 */

import { Card } from './card'
import { Badge } from './badge'
import { Button } from './button'
import type { MarketingContentResult } from '../../../apps/web/types/marketing'

interface MarketingResultProps {
  data: MarketingContentResult
  onCopy?: (text: string) => void
  onRegenerate?: () => void
  className?: string
}

const PLATFORM_LABELS = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  twitter: 'Twitter/X',
  linkedin: 'LinkedIn',
  email: 'Email',
  tiktok: 'TikTok',
} as const

const PLATFORM_ICONS = {
  instagram: '📸',
  facebook: '👥',
  twitter: '🐦',
  linkedin: '💼',
  email: '📧',
  tiktok: '🎵',
} as const

/**
 * Result display component for generated marketing content
 *
 * @param {MarketingResultProps} props - Component props
 * @returns {React.JSX.Element} Result display component
 *
 * @example
 * <MarketingResult
 *   data={generatedContent}
 *   onCopy={(text) => navigator.clipboard.writeText(text)}
 *   onRegenerate={() => regenerate()}
 * />
 */
export function MarketingResult({
  data,
  onCopy,
  onRegenerate,
  className = '',
}: MarketingResultProps): React.JSX.Element {
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
      `📱 Konten untuk ${PLATFORM_LABELS[data.platform as keyof typeof PLATFORM_LABELS]}`,
      '',
      data.content,
      '',
      data.hashtags.length > 0 ? `Hashtags: ${data.hashtags.join(' ')}` : '',
      data.hashtags.length > 0 ? '' : '',
      `CTA: ${data.callToAction}`,
    ]
      .filter(line => line !== '')
      .join('\n')

    void handleCopy(allText)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Platform Header */}
      <Card className="p-6">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">
            {PLATFORM_ICONS[data.platform as keyof typeof PLATFORM_ICONS]}
          </span>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Konten {PLATFORM_LABELS[data.platform as keyof typeof PLATFORM_LABELS]}
            </h3>
            <p className="text-sm text-muted-foreground">
              Konten pemasaran yang dioptimalkan untuk platform ini
            </p>
          </div>
        </div>
      </Card>

      {/* Content */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Konten Pemasaran
            </h4>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                {data.content}
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleCopyClick(data.content)}
            className="ml-4"
          >
            Salin
          </Button>
        </div>
      </Card>

      {/* Hashtags */}
      {data.hashtags.length > 0 && (
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                Hashtags
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.hashtags.map((hashtag: string) => (
                  <Badge key={hashtag} color="purple">
                    {hashtag}
                  </Badge>
                ))}
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleCopyClick(data.hashtags.join(' '))}
              className="ml-4"
            >
              Salin
            </Button>
          </div>
        </Card>
      )}

      {/* Call to Action */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Call to Action
            </h4>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-blue-900 dark:text-blue-100 font-medium">{data.callToAction}</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleCopyClick(data.callToAction)}
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
