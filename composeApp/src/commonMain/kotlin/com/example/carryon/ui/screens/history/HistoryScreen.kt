package com.example.carryon.ui.screens.history

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
import carryon.composeapp.generated.resources.icon_home
import carryon.composeapp.generated.resources.icon_profile
import carryon.composeapp.generated.resources.icon_messages
import carryon.composeapp.generated.resources.icon_search
import carryon.composeapp.generated.resources.bell_icon
import org.jetbrains.compose.resources.painterResource
import com.example.carryon.ui.theme.*

data class OrderHistory(
    val orderId: String,
    val recipient: String,
    val location: String,
    val date: String,
    val status: String
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HistoryScreen(
    onInstantDelivery: () -> Unit,
    onScheduleDelivery: () -> Unit,
    onOrderClick: (String) -> Unit,
    onViewAll: () -> Unit
) {
    val orderHistory = remember {
        listOf(
            OrderHistory("ORDB1234", "Paul Pogba", "Maryland bustop, Anthony Ikeja", "12 January 2020, 2:43pm", "Completed"),
            OrderHistory("ORDB1234", "Paul Pogba", "Maryland bustop, Anthony Ikeja", "12 January 2020, 2:43pm", "Completed")
        )
    }
    
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
                    IconButton(onClick = { }) {
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
            BottomNavigationBar(selectedIndex = 2)
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(Color.White)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 16.dp)
        ) {
            Spacer(modifier = Modifier.height(8.dp))
            
            // Delivery in Progress Banner
            Text(
                text = "You have 1 delivery in progress",
                fontSize = 13.sp,
                color = TextSecondary
            )
            
            Spacer(modifier = Modifier.height(12.dp))
            
            // Active Delivery Card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onOrderClick("ORDB1234") },
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFF8F9FA)),
                elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "ORDB1234",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = PrimaryBlue
                        )
                        Text(
                            text = "Receipient: Paul Pogba",
                            fontSize = 13.sp,
                            color = TextSecondary
                        )
                        Row {
                            Text(
                                text = "20 mins",
                                fontSize = 13.sp,
                                color = PrimaryBlue,
                                fontWeight = FontWeight.Medium
                            )
                            Text(
                                text = " to delivery location",
                                fontSize = 13.sp,
                                color = TextSecondary
                            )
                        }
                    }
                    
                    Box(
                        modifier = Modifier
                            .background(PrimaryBlue.copy(alpha = 0.1f), RoundedCornerShape(8.dp))
                            .padding(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = "In progress",
                            fontSize = 12.sp,
                            color = PrimaryBlue,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(24.dp))
            
            // What would you like to do?
            Text(
                text = "What would you like to do?",
                fontSize = 14.sp,
                color = TextSecondary
            )
            
            Spacer(modifier = Modifier.height(12.dp))
            
            // Instant Delivery Card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onInstantDelivery() },
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = PrimaryBlue),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
            ) {
                Box(modifier = Modifier.fillMaxWidth()) {
                    Column(
                        modifier = Modifier.padding(20.dp)
                    ) {
                        Text("⚡", fontSize = 24.sp)
                        
                        Spacer(modifier = Modifier.height(8.dp))
                        
                        Text(
                            text = "Instant Delivery",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                        
                        Text(
                            text = "Courier takes only your package and delivers instantly",
                            fontSize = 13.sp,
                            color = Color.White.copy(alpha = 0.8f)
                        )
                    }
                    
                    // Background bike icon
                    Text(
                        text = "🏍️",
                        fontSize = 60.sp,
                        modifier = Modifier
                            .align(Alignment.CenterEnd)
                            .padding(end = 16.dp),
                        color = Color.White.copy(alpha = 0.3f)
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            
            // Schedule Delivery Card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onScheduleDelivery() },
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFF8F9FA)),
                elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
            ) {
                Box(modifier = Modifier.fillMaxWidth()) {
                    Column(
                        modifier = Modifier.padding(20.dp)
                    ) {
                        Text("⏰", fontSize = 24.sp)
                        
                        Spacer(modifier = Modifier.height(8.dp))
                        
                        Text(
                            text = "Schedule Delivery",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                        
                        Text(
                            text = "Courier comes to pick up on your specified date and time",
                            fontSize = 13.sp,
                            color = TextSecondary
                        )
                    }
                    
                    // Background clock icon
                    Text(
                        text = "🕐",
                        fontSize = 60.sp,
                        modifier = Modifier
                            .align(Alignment.CenterEnd)
                            .padding(end = 16.dp),
                        color = Color.LightGray.copy(alpha = 0.5f)
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(24.dp))
            
            // History Section
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "History",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
                
                TextButton(onClick = onViewAll) {
                    Text(
                        text = "View all",
                        fontSize = 13.sp,
                        color = PrimaryBlue
                    )
                }
            }
            
            // History Items
            orderHistory.forEach { order ->
                HistoryItem(
                    order = order,
                    onClick = { onOrderClick(order.orderId) }
                )
                
                HorizontalDivider(
                    modifier = Modifier.padding(vertical = 12.dp),
                    color = Color.LightGray.copy(alpha = 0.5f)
                )
            }
            
            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

@Composable
private fun HistoryItem(
    order: OrderHistory,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        verticalAlignment = Alignment.Top
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = order.orderId,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = PrimaryBlue
                )
                
                Box(
                    modifier = Modifier
                        .background(PrimaryBlue, RoundedCornerShape(4.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = order.status,
                        fontSize = 11.sp,
                        color = Color.White,
                        fontWeight = FontWeight.Medium
                    )
                }
            }
            
            Text(
                text = "Receipient: ${order.recipient}",
                fontSize = 13.sp,
                color = TextSecondary
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .background(PrimaryBlueSurface, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text("🏍️", fontSize = 16.sp)
                }
                
                Spacer(modifier = Modifier.width(12.dp))
                
                Column {
                    Row {
                        Text("📍 ", fontSize = 12.sp, color = PrimaryBlue)
                        Text(
                            text = "Drop off",
                            fontSize = 12.sp,
                            color = TextSecondary
                        )
                    }
                    Text(
                        text = order.location,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium
                    )
                    Text(
                        text = order.date,
                        fontSize = 12.sp,
                        color = TextSecondary
                    )
                }
            }
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
