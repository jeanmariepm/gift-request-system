# Integration Examples

Real-world examples of how to integrate the Gift Request System into different types of applications.

## Table of Contents

1. [HTML/JavaScript](#htmljavascript)
2. [React](#react)
3. [Next.js](#nextjs)
4. [Vue.js](#vuejs)
5. [Angular](#angular)
6. [WordPress](#wordpress)
7. [Django/Python](#djangopython)
8. [Ruby on Rails](#ruby-on-rails)
9. [ASP.NET](#aspnet)

---

## HTML/JavaScript

### Simple Link

```html
<!-- In your dashboard.html -->
<a href="#" id="giftRequestLink" class="btn btn-primary">
    Submit Gift Request
</a>

<script>
document.getElementById('giftRequestLink').addEventListener('click', function(e) {
    e.preventDefault();
    
    // Get current user (from your auth system)
    const user = getCurrentUser(); // Your function
    
    // Build URL
    const baseUrl = 'https://your-gift-system.vercel.app';
    const params = new URLSearchParams({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        companyName: user.company,
        department: user.department
    });
    
    // Open in new tab
    window.open(`${baseUrl}/?${params.toString()}`, '_blank');
});
</script>
```

---

## React

### Functional Component with Hook

```jsx
import { useAuth } from './hooks/useAuth'; // Your auth hook

function Dashboard() {
    const { user } = useAuth();
    
    const handleGiftRequest = () => {
        const baseUrl = process.env.REACT_APP_GIFT_SYSTEM_URL;
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
        <div>
            <h1>Welcome, {user.name}</h1>
            <button onClick={handleGiftRequest}>
                🎁 Submit Gift Request
            </button>
        </div>
    );
}

export default Dashboard;
```

### Custom Hook

```jsx
// hooks/useGiftRequest.js
import { useCallback } from 'react';
import { useAuth } from './useAuth';

export function useGiftRequest() {
    const { user } = useAuth();
    const baseUrl = process.env.REACT_APP_GIFT_SYSTEM_URL;
    
    const openGiftRequest = useCallback(() => {
        const params = new URLSearchParams({
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            companyName: user.company,
            department: user.department
        });
        
        window.open(`${baseUrl}/?${params.toString()}`, '_blank');
    }, [user, baseUrl]);
    
    const openMySubmissions = useCallback(() => {
        const params = new URLSearchParams({
            userId: user.id,
            userName: user.name,
            userEmail: user.email
        });
        
        window.open(`${baseUrl}/my-submissions?${params.toString()}`, '_blank');
    }, [user, baseUrl]);
    
    return { openGiftRequest, openMySubmissions };
}

// Usage
function Dashboard() {
    const { openGiftRequest, openMySubmissions } = useGiftRequest();
    
    return (
        <div>
            <button onClick={openGiftRequest}>Submit Gift Request</button>
            <button onClick={openMySubmissions}>View My Submissions</button>
        </div>
    );
}
```

---

## Next.js

### App Router (Next.js 13+)

```tsx
// app/dashboard/page.tsx
'use client'

import { useSession } from 'next-auth/react';

export default function DashboardPage() {
    const { data: session } = useSession();
    
    const openGiftRequest = () => {
        if (!session?.user) return;
        
        const baseUrl = process.env.NEXT_PUBLIC_GIFT_SYSTEM_URL;
        const params = new URLSearchParams({
            userId: session.user.id,
            userName: session.user.name!,
            userEmail: session.user.email!,
            companyName: session.user.company,
            department: session.user.department
        });
        
        window.open(`${baseUrl}/?${params.toString()}`, '_blank');
    };
    
    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={openGiftRequest}>
                Submit Gift Request
            </button>
        </div>
    );
}
```

### Pages Router (Next.js 12 and below)

```tsx
// pages/dashboard.tsx
import { useSession } from 'next-auth/react';

export default function Dashboard() {
    const { data: session } = useSession();
    
    const openGiftRequest = () => {
        const baseUrl = process.env.NEXT_PUBLIC_GIFT_SYSTEM_URL;
        const params = new URLSearchParams({
            userId: session.user.id,
            userName: session.user.name,
            userEmail: session.user.email,
            companyName: session.user.company,
            department: session.user.department
        });
        
        window.open(`${baseUrl}/?${params.toString()}`, '_blank');
    };
    
    return (
        <button onClick={openGiftRequest}>
            Submit Gift Request
        </button>
    );
}
```

---

## Vue.js

### Vue 3 Composition API

```vue
<template>
    <div>
        <h1>Dashboard</h1>
        <button @click="openGiftRequest">
            🎁 Submit Gift Request
        </button>
        <button @click="openMySubmissions">
            📊 View My Submissions
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const user = computed(() => userStore.user);

const openGiftRequest = () => {
    const baseUrl = import.meta.env.VITE_GIFT_SYSTEM_URL;
    const params = new URLSearchParams({
        userId: user.value.id,
        userName: user.value.name,
        userEmail: user.value.email,
        companyName: user.value.company,
        department: user.value.department
    });
    
    window.open(`${baseUrl}/?${params.toString()}`, '_blank');
};

const openMySubmissions = () => {
    const baseUrl = import.meta.env.VITE_GIFT_SYSTEM_URL;
    const params = new URLSearchParams({
        userId: user.value.id
    });
    
    window.open(`${baseUrl}/my-submissions?${params.toString()}`, '_blank');
};
</script>
```

---

## Angular

### Component

```typescript
// dashboard.component.ts
import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { environment } from '../environments/environment';

@Component({
    selector: 'app-dashboard',
    template: `
        <div>
            <h1>Dashboard</h1>
            <button (click)="openGiftRequest()">
                🎁 Submit Gift Request
            </button>
        </div>
    `
})
export class DashboardComponent {
    constructor(private authService: AuthService) {}
    
    openGiftRequest(): void {
        const user = this.authService.getCurrentUser();
        const baseUrl = environment.giftSystemUrl;
        
        const params = new URLSearchParams({
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            companyName: user.company,
            department: user.department
        });
        
        window.open(`${baseUrl}/?${params.toString()}`, '_blank');
    }
}
```

---

## WordPress

### Add to Theme

```php
<?php
// In your theme's functions.php or custom plugin

// Add gift request button to user dashboard
function add_gift_request_button() {
    if (!is_user_logged_in()) {
        return '';
    }
    
    $current_user = wp_get_current_user();
    
    $params = http_build_query([
        'userId' => $current_user->ID,
        'userName' => $current_user->display_name,
        'userEmail' => $current_user->user_email,
        'companyName' => get_user_meta($current_user->ID, 'company_name', true),
        'department' => get_user_meta($current_user->ID, 'department', true)
    ]);
    
    $gift_system_url = get_option('gift_system_url', 'https://your-gift-system.vercel.app');
    $url = $gift_system_url . '/?' . $params;
    
    return sprintf(
        '<a href="%s" target="_blank" class="button button-primary">Submit Gift Request</a>',
        esc_url($url)
    );
}
add_shortcode('gift_request_button', 'add_gift_request_button');

// Usage in your template or page:
// [gift_request_button]
?>
```

### WordPress Plugin

```php
<?php
/*
Plugin Name: Gift Request Integration
Description: Integrates with external gift request system
Version: 1.0
*/

class GiftRequestIntegration {
    public function __construct() {
        add_action('admin_menu', [$this, 'add_settings_page']);
        add_shortcode('gift_request', [$this, 'render_button']);
    }
    
    public function add_settings_page() {
        add_options_page(
            'Gift Request Settings',
            'Gift Request',
            'manage_options',
            'gift-request',
            [$this, 'settings_page']
        );
    }
    
    public function render_button() {
        if (!is_user_logged_in()) {
            return '<p>Please log in to submit a gift request.</p>';
        }
        
        $user = wp_get_current_user();
        $url = $this->build_gift_request_url($user);
        
        return sprintf(
            '<a href="%s" target="_blank" class="button">🎁 Submit Gift Request</a>',
            esc_url($url)
        );
    }
    
    private function build_gift_request_url($user) {
        $params = http_build_query([
            'userId' => $user->ID,
            'userName' => $user->display_name,
            'userEmail' => $user->user_email,
            'companyName' => get_user_meta($user->ID, 'company_name', true),
            'department' => get_user_meta($user->ID, 'department', true)
        ]);
        
        $base_url = get_option('gift_system_url', '');
        return $base_url . '/?' . $params;
    }
}

new GiftRequestIntegration();
?>
```

---

## Django/Python

### View

```python
# views.py
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.conf import settings
from urllib.parse import urlencode

@login_required
def dashboard(request):
    user = request.user
    
    # Build gift request URL
    params = {
        'userId': str(user.id),
        'userName': user.get_full_name(),
        'userEmail': user.email,
        'companyName': user.profile.company_name,
        'department': user.profile.department
    }
    
    gift_request_url = f"{settings.GIFT_SYSTEM_URL}/?{urlencode(params)}"
    
    context = {
        'gift_request_url': gift_request_url
    }
    
    return render(request, 'dashboard.html', context)
```

### Template

```html
<!-- templates/dashboard.html -->
{% extends 'base.html' %}

{% block content %}
<div class="dashboard">
    <h1>Welcome, {{ user.get_full_name }}</h1>
    
    <a href="{{ gift_request_url }}" target="_blank" class="btn btn-primary">
        🎁 Submit Gift Request
    </a>
</div>
{% endblock %}
```

### Settings

```python
# settings.py
GIFT_SYSTEM_URL = env('GIFT_SYSTEM_URL', default='https://your-gift-system.vercel.app')
```

---

## Ruby on Rails

### Controller

```ruby
# app/controllers/dashboard_controller.rb
class DashboardController < ApplicationController
  before_action :authenticate_user!
  
  def index
    @gift_request_url = build_gift_request_url(current_user)
  end
  
  private
  
  def build_gift_request_url(user)
    base_url = ENV['GIFT_SYSTEM_URL']
    params = {
      userId: user.id,
      userName: user.full_name,
      userEmail: user.email,
      companyName: user.company_name,
      department: user.department
    }
    
    "#{base_url}/?#{params.to_query}"
  end
end
```

### View

```erb
<!-- app/views/dashboard/index.html.erb -->
<div class="dashboard">
  <h1>Welcome, <%= current_user.full_name %></h1>
  
  <%= link_to '🎁 Submit Gift Request', 
      @gift_request_url, 
      target: '_blank', 
      class: 'btn btn-primary' %>
</div>
```

---

## ASP.NET

### Controller (ASP.NET Core)

```csharp
// Controllers/DashboardController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Web;

[Authorize]
public class DashboardController : Controller
{
    private readonly IConfiguration _configuration;
    
    public DashboardController(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    
    public IActionResult Index()
    {
        var user = HttpContext.User;
        var giftRequestUrl = BuildGiftRequestUrl(user);
        
        ViewBag.GiftRequestUrl = giftRequestUrl;
        return View();
    }
    
    private string BuildGiftRequestUrl(ClaimsPrincipal user)
    {
        var baseUrl = _configuration["GiftSystemUrl"];
        
        var queryParams = HttpUtility.ParseQueryString(string.Empty);
        queryParams["userId"] = user.FindFirst("sub")?.Value;
        queryParams["userName"] = user.FindFirst("name")?.Value;
        queryParams["userEmail"] = user.FindFirst("email")?.Value;
        queryParams["companyName"] = user.FindFirst("company")?.Value;
        queryParams["department"] = user.FindFirst("department")?.Value;
        
        return $"{baseUrl}/?{queryParams}";
    }
}
```

### View (Razor)

```cshtml
@* Views/Dashboard/Index.cshtml *@

<div class="dashboard">
    <h1>Welcome, @User.Identity.Name</h1>
    
    <a href="@ViewBag.GiftRequestUrl" target="_blank" class="btn btn-primary">
        🎁 Submit Gift Request
    </a>
</div>
```

---

## Testing the Integration

### Test Checklist

- [ ] User data is correctly passed in URL
- [ ] URL encoding handles special characters
- [ ] Link opens in new tab/window
- [ ] User info appears as read-only in gift form
- [ ] Form submission works correctly
- [ ] User can view their submissions
- [ ] Works in different browsers
- [ ] Works on mobile devices

### Example Test URL

```
https://your-gift-system.vercel.app/?userId=123&userName=John%20Doe&userEmail=john%40example.com&companyName=Acme%20Corp&department=Engineering
```

---

## Security Best Practices

1. **Always validate authentication** before generating links
2. **Use HTTPS** in production
3. **Sanitize user input** to prevent XSS
4. **Consider token-based auth** for extra security
5. **Log access** for audit trails
6. **Rate limit** link generation to prevent abuse

---

Need help with a different framework? Check the main README or create an issue!

