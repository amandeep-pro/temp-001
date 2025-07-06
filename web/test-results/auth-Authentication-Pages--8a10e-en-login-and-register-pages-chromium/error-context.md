# Page snapshot

```yaml
- alert
- button "Open Next.js Dev Tools":
  - img
- text: Sign Up Create an account to start managing your todos Name (Optional)
- textbox "Name (Optional)"
- text: Email
- textbox "Email"
- text: Password
- textbox "Password"
- text: Confirm Password
- textbox "Confirm Password"
- button "Sign Up"
- paragraph:
  - text: Already have an account?
  - link "Login":
    - /url: /login
```