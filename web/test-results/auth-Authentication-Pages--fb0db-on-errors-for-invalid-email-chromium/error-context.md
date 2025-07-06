# Page snapshot

```yaml
- heading "Login" [level=2]
- paragraph:
  - text: Or
  - link "create a new account":
    - /url: /register
- text: Email
- textbox "Email": invalid-email
- text: Password
- textbox "Password"
- button "Login"
- paragraph:
  - text: Don't have an account?
  - link "Sign up":
    - /url: /register
- alert
- button "Open Next.js Dev Tools":
  - img
```