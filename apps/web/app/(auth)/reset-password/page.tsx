import { ResetPasswordForm } from './ResetPasswordForm'
import { InvalidToken } from '../_components/InvalidToken'

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function ResetPasswordPage({ 
  searchParams 
}: ResetPasswordPageProps): Promise<React.JSX.Element> {
  const params = await searchParams
  const token = params.token

  if (token === undefined || token === '') {
    return <InvalidToken />
  }

  return <ResetPasswordForm token={token} />
}
