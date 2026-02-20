package com.example.carryon.ui.screens.profile

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import carryon.composeapp.generated.resources.Res
import carryon.composeapp.generated.resources.carryon_logo
import carryon.composeapp.generated.resources.icon_home
import carryon.composeapp.generated.resources.icon_profile
import carryon.composeapp.generated.resources.icon_messages
import carryon.composeapp.generated.resources.icon_search
import carryon.composeapp.generated.resources.bell_icon
import org.jetbrains.compose.resources.painterResource
import com.example.carryon.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    onNavigateToEditProfile: () -> Unit,
    onNavigateToSavedAddresses: () -> Unit,
    onNavigateToHelp: () -> Unit,
    onNavigateToOrders: () -> Unit,
    onNavigateToCalculate: () -> Unit,
    onNavigateToHistory: () -> Unit,
    onNavigateToTrackShipment: () -> Unit,
    onNavigateToDriverRating: () -> Unit,
    onLogout: () -> Unit,
    onBack: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Text(
                            text = "Carry",
                            fontSize = 22.sp,
                            fontWeight = FontWeight.Bold,
                            color = PrimaryBlue,
                            fontStyle = androidx.compose.ui.text.font.FontStyle.Italic
                        )
                        Text(
                            text = " On",
                            fontSize = 22.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Text("☰", fontSize = 20.sp)
                    }
                },
                actions = {
                    IconButton(onClick = { }) {
                        Image(
                            painter = painterResource(Res.drawable.bell_icon),
                            contentDescription = "Notifications",
                            modifier = Modifier.size(24.dp),
                            contentScale = ContentScale.Fit
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color.White
                )
            )
        },
        bottomBar = {
            BottomNavigationBar(selectedIndex = 3)
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(Color.White)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp)
        ) {
            Spacer(modifier = Modifier.height(16.dp))
            
            // Profile Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Hi There!",
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                    Text(
                        text = "Devansh Chauhan",
                        fontSize = 18.sp,
                        color = TextPrimary
                    )
                }
                
                // Profile Avatar - using app logo as placeholder
                Box(
                    modifier = Modifier
                        .size(70.dp)
                        .clip(CircleShape)
                        .background(PrimaryBlue)
                ) {
                    Image(
                        painter = painterResource(Res.drawable.carryon_logo),
                        contentDescription = "Profile",
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(24.dp))
            
            // Action Buttons Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                ActionButton(
                    text = "Help",
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToHelp
                )
                ActionButton(
                    text = "Wallet",
                    modifier = Modifier.weight(1f),
                    onClick = { }
                )
                ActionButton(
                    text = "Trips",
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToOrders
                )
            }
            
            Spacer(modifier = Modifier.height(40.dp))
            
            // Menu Options
            MenuOption(
                icon = "🧮",
                title = "Calculate Shipping",
                onClick = onNavigateToCalculate
            )
            
            Spacer(modifier = Modifier.height(24.dp))
            
            MenuOption(
                icon = "📜",
                title = "Order History",
                onClick = onNavigateToHistory
            )
            
            Spacer(modifier = Modifier.height(24.dp))
            
            MenuOption(
                icon = "📍",
                title = "Track Shipment",
                onClick = onNavigateToTrackShipment
            )
            
            Spacer(modifier = Modifier.height(24.dp))
            
            MenuOption(
                icon = "⭐",
                title = "Rate Driver",
                onClick = onNavigateToDriverRating
            )
            
            Spacer(modifier = Modifier.height(24.dp))
            
            MenuOption(
                icon = "🏷️",
                title = "Apply Promo Code",
                onClick = { }
            )
            
            Spacer(modifier = Modifier.height(24.dp))
            
            MenuOption(
                icon = "⚙️",
                title = "Settings",
                onClick = { }
            )
            
            Spacer(modifier = Modifier.height(24.dp))
            
            MenuOption(
                icon = "👥",
                title = "Help and support",
                onClick = onNavigateToHelp
            )
            
            Spacer(modifier = Modifier.height(24.dp))
            
            // Logout
            MenuOption(
                icon = "🚪",
                title = "Logout",
                titleColor = PrimaryBlue,
                onClick = onLogout
            )
            
            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}

@Composable
private fun ActionButton(
    text: String,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Button(
        onClick = onClick,
        modifier = modifier.height(48.dp),
        shape = RoundedCornerShape(12.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = PrimaryBlue
        )
    ) {
        Text(
            text = text,
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium
        )
    }
}

@Composable
private fun MenuOption(
    icon: String,
    title: String,
    titleColor: Color = TextPrimary,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(icon, fontSize = 24.sp)
        
        Spacer(modifier = Modifier.width(16.dp))
        
        Text(
            text = title,
            fontSize = 16.sp,
            color = titleColor,
            modifier = Modifier.weight(1f)
        )
        
        Box(
            modifier = Modifier
                .size(36.dp)
                .background(Color(0xFFF0F0F0), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Text(">", fontSize = 16.sp, color = TextSecondary)
        }
    }
}

@Composable
private fun BottomNavigationBar(selectedIndex: Int) {
    NavigationBar(
        containerColor = Color.White,
        tonalElevation = 8.dp
    ) {
        val items = listOf(
            Pair(Res.drawable.icon_search, "Search"),
            Pair(Res.drawable.icon_messages, "Messages"),
            Pair(Res.drawable.icon_home, "Home"),
            Pair(Res.drawable.icon_profile, "Profile")
        )
        
        items.forEachIndexed { index, (iconRes, label) ->
            NavigationBarItem(
                icon = {
                    Image(
                        painter = painterResource(iconRes),
                        contentDescription = label,
                        modifier = Modifier.size(24.dp),
                        contentScale = ContentScale.Fit
                    )
                },
                selected = selectedIndex == index,
                onClick = { },
                colors = NavigationBarItemDefaults.colors(
                    indicatorColor = Color.Transparent
                )
            )
        }
    }
}
