import Form from "@packages/client/src/components/form/form"
import { Button } from "@packages/client/src/components/ui/button"
import { Card, CardContent } from "@packages/client/src/components/ui/card"
import { Input } from "@packages/client/src/components/ui/input"
import { loginAction } from "./actions"

function Login() {
  
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <form action={loginAction}>
        <h1 className="text-2xl font-semibold mb-8 text-center">Login To Your Account</h1>
        <Card className="flex gap-7 flex-col">
          <CardContent className="space-y-6 w-[400px] p-8">
            <div>
              <label 
                className="text-sm mb-2"
                htmlFor="email"
              >Email</label>
              <Input
                name="email"
                id="email"
                type="email"
                required
                placeholder="Enter Your Email"
              />
            </div>
            <div>
              <label 
                className="text-sm mb-2"
                htmlFor="password"
              >Password</label>
              <Input
                required
                name="password"
                id="password"
                type="password"
                placeholder="Enter your Password"
              />
            </div>
            <Button className="w-full font-medium" variant='primary'>
              Login 
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

export default Login