package com.example.carryon

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform