import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserSignup } from './user-signup'
import { UserLogin } from './user-login'

export const UserForm = () => {
  return (
    <Tabs defaultValue='signup' className='w-[400px]'>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='signup'>Sign up</TabsTrigger>
        <TabsTrigger value='login'>Login</TabsTrigger>
      </TabsList>
      <TabsContent value='signup'>
        <Card>
          <CardHeader>
            <CardTitle>Sign up</CardTitle>
            <CardDescription>
              Enter your account details here. Click Sign up when you're done.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserSignup />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value='login'>
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Welcome back! After entering your information, click Login.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserLogin />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
