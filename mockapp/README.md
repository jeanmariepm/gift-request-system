# Mock Main App

This is a simple mockup demonstrating how your main application would integrate with the Gift Request System.

## What This Demonstrates

This mock app shows:
1. How users would "log in" to your main app
2. How to collect and store user information
3. How to generate the correct URL to link to the Gift Request System
4. How to pass user data via URL parameters

## How to Use

### Option 1: Open Directly in Browser

Simply open the `index.html` file in your web browser:

```bash
# Mac/Linux
open mockapp/index.html

# Or just double-click the file in Finder/Explorer
```

### Option 2: Run with a Local Server

For a more realistic experience:

```bash
# If you have Python installed
cd mockapp
python3 -m http.server 8080

# Then visit: http://localhost:8080
```

## Testing the Integration

1. **Open the mock app** (`mockapp/index.html`)

2. **Enter user information:**
   - User ID: `emp12345`
   - Full Name: `John Doe`
   - Email: `john.doe@company.com`
   - Company: `Acme Corporation`
   - Department: `Engineering`

3. **Click "Log In to Portal"**

4. **Start the Gift Request System** (in another terminal):
   ```bash
   npm run dev
   ```

5. **Click "🎁 Submit Gift Request"** button in the mock app
   - This will open the Gift Request System in a new tab
   - User data will be pre-filled
   - You can submit a gift request

6. **Click "📊 View My Gift Requests"** to see submissions

## Configuration

### Change the Gift System URL

In the mock app, there's a settings section at the bottom where you can change the URL:

- **Local Development**: `http://localhost:3000`
- **Production**: `https://your-app.vercel.app`

The mock app remembers this setting in your browser.

## How It Works

### 1. User "Login"

The mock app collects user information and stores it in `localStorage`:

```javascript
userData = {
    userId: 'emp12345',
    userName: 'John Doe',
    userEmail: 'john.doe@company.com',
    companyName: 'Acme Corporation',
    department: 'Engineering'
}
```

### 2. Generate Gift Request URL

When the user clicks "Submit Gift Request", the app builds a URL:

```javascript
function buildGiftRequestUrl(baseUrl) {
    const params = new URLSearchParams({
        userId: userData.userId,
        userName: userData.userName,
        userEmail: userData.userEmail,
        companyName: userData.companyName,
        department: userData.department
    });
    
    return `${baseUrl}/?${params.toString()}`;
}
```

This creates a URL like:
```
http://localhost:3000/?userId=emp12345&userName=John%20Doe&userEmail=john.doe@company.com&companyName=Acme%20Corporation&department=Engineering
```

### 3. Open Gift Request System

The URL opens in a new tab:

```javascript
window.open(url, '_blank');
```

## Integration Code for Your Real App

Here's how to integrate this into your actual application:

### React/Next.js Example

```javascript
// In your React component
function UserDashboard({ user }) {
  const openGiftRequestForm = () => {
    const baseUrl = process.env.NEXT_PUBLIC_GIFT_SYSTEM_URL;
    const params = new URLSearchParams({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      companyName: user.company,
      department: user.department
    });
    
    window.open(`${baseUrl}/?${params.toString()}`, '_blank');
  };

  return (
    <button onClick={openGiftRequestForm}>
      Submit Gift Request
    </button>
  );
}
```

### Express/Node.js Backend Example

```javascript
// Generate URL on backend
app.get('/gift-request-link', (req, res) => {
  const user = req.user; // From your auth system
  
  const params = new URLSearchParams({
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    companyName: user.company,
    department: user.department
  });
  
  const url = `${process.env.GIFT_SYSTEM_URL}/?${params.toString()}`;
  
  res.json({ url });
});
```

### PHP Example

```php
<?php
// In your PHP application
function getGiftRequestUrl($user) {
    $params = http_build_query([
        'userId' => $user['id'],
        'userName' => $user['name'],
        'userEmail' => $user['email'],
        'companyName' => $user['company'],
        'department' => $user['department']
    ]);
    
    return getenv('GIFT_SYSTEM_URL') . '/?' . $params;
}

$giftUrl = getGiftRequestUrl($currentUser);
echo '<a href="' . $giftUrl . '" target="_blank">Submit Gift Request</a>';
?>
```

## Features Demonstrated

✅ User information collection  
✅ Data persistence (localStorage)  
✅ URL generation with parameters  
✅ Opening in new tab  
✅ Configuration for different environments  
✅ Link to view submissions  
✅ Logout functionality  

## Customization

You can customize the mock app by editing `index.html`:

1. **Add more fields** - Add inputs to the form
2. **Change styling** - Modify the CSS in the `<style>` section
3. **Add validation** - Enhance the JavaScript validation
4. **Add more links** - Create additional quick actions

## Security Notes

**Important**: In your real application:

1. ✅ **Validate user authentication** before generating links
2. ✅ **Use HTTPS** in production
3. ✅ **Sanitize user input** before passing as URL parameters
4. ✅ **Sign tokens** if you need to verify the data wasn't tampered with
5. ✅ **Consider using POST requests** for sensitive data instead of URL parameters

## Next Steps

1. Test the mock app with the Gift Request System
2. Understand how the URL parameters work
3. Implement similar logic in your real application
4. Deploy both systems and update the URLs
5. Test the integration end-to-end

---

**💡 Tip**: This mock app is for demonstration only. In production, your real app would already have user information from your authentication system!

