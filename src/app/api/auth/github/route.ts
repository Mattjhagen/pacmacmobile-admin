import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, state } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        state,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return NextResponse.json(
        { error: `GitHub OAuth error: ${tokenData.error_description || tokenData.error}` },
        { status: 400 }
      );
    }

    const accessToken = tokenData.access_token;

    // Get user information from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch user information from GitHub' },
        { status: 500 }
      );
    }

    const userData = await userResponse.json();

    // Get user email (if not public)
    let email = userData.email;
    if (!email) {
      try {
        const emailResponse = await fetch('https://api.github.com/user/emails', {
          headers: {
            'Authorization': `token ${accessToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        });

        if (emailResponse.ok) {
          const emails = await emailResponse.json();
          const primaryEmail = emails.find((email: any) => email.primary);
          if (primaryEmail) {
            email = primaryEmail.email;
          }
        }
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    }

    // Format user data
    const user = {
      id: userData.id.toString(),
      name: userData.name || userData.login,
      email: email || `${userData.login}@users.noreply.github.com`,
      login: userData.login,
      avatar: userData.avatar_url,
      location: userData.location,
      bio: userData.bio,
      public_repos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
    };

    return NextResponse.json({
      success: true,
      user,
      token: accessToken,
    });

  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return NextResponse.json(
      { 
        error: 'Authentication failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
