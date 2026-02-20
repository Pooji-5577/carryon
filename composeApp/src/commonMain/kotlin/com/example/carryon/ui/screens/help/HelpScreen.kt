package com.example.carryon.ui.screens.help

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.carryon.ui.theme.*

data class FaqItem(
    val question: String,
    val answer: String
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HelpScreen(
    onBack: () -> Unit
) {
    val faqs = remember {
        listOf(
            FaqItem(
                "How do I book a delivery?",
                "Enter your pickup and delivery locations on the home screen, select a vehicle type, and tap 'Book Now'. You'll see the estimated price before confirming."
            ),
            FaqItem(
                "How is the price calculated?",
                "The price includes a base fare plus a per-kilometer charge based on the vehicle type and distance. During peak hours, there may be additional surge charges."
            ),
            FaqItem(
                "Can I schedule a delivery for later?",
                "Yes! On the home screen, tap on 'Schedule' to book a delivery for a future date and time."
            ),
            FaqItem(
                "How do I track my delivery?",
                "Once your booking is confirmed and a driver is assigned, you can track the delivery in real-time on the tracking screen."
            ),
            FaqItem(
                "What payment methods are accepted?",
                "We accept Cash, UPI, Credit/Debit Cards, and Wallet payments."
            ),
            FaqItem(
                "How do I cancel a booking?",
                "You can cancel a booking from the tracking screen before the driver picks up your package. Cancellation charges may apply."
            ),
            FaqItem(
                "What if my package is damaged?",
                "We have insurance coverage for all deliveries. Contact our support team within 24 hours of delivery to file a claim."
            ),
            FaqItem(
                "How do I contact the driver?",
                "You can call the driver directly from the tracking screen once they are assigned to your booking."
            )
        )
    }
    
    var expandedFaq by remember { mutableStateOf<Int?>(null) }
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Help & Support") },
                navigationIcon = {
                    TextButton(onClick = onBack) {
                        Text("← Back", color = Color.Black)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color.White
                )
            )
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(BackgroundLight),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Contact Options
            item {
                Text(
                    text = "Contact Us",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
                
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White)
                ) {
                    Column {
                        ContactOption(
                            icon = "📞",
                            title = "Call Us",
                            subtitle = "Available 24/7",
                            onClick = { }
                        )
                        HorizontalDivider(color = Color.LightGray.copy(alpha = 0.5f))
                        ContactOption(
                            icon = "💬",
                            title = "Chat Support",
                            subtitle = "Typically replies in 5 minutes",
                            onClick = { }
                        )
                        HorizontalDivider(color = Color.LightGray.copy(alpha = 0.5f))
                        ContactOption(
                            icon = "📧",
                            title = "Email Us",
                            subtitle = "support@carryon.com",
                            onClick = { }
                        )
                    }
                }
            }
            
            // Quick Help Topics
            item {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Quick Help",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
                
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    QuickHelpCard(
                        icon = "📦",
                        title = "Track Order",
                        modifier = Modifier.weight(1f),
                        onClick = { }
                    )
                    QuickHelpCard(
                        icon = "💳",
                        title = "Payment Issue",
                        modifier = Modifier.weight(1f),
                        onClick = { }
                    )
                }
                
                Spacer(modifier = Modifier.height(12.dp))
                
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    QuickHelpCard(
                        icon = "🚫",
                        title = "Cancel Order",
                        modifier = Modifier.weight(1f),
                        onClick = { }
                    )
                    QuickHelpCard(
                        icon = "💰",
                        title = "Refund Status",
                        modifier = Modifier.weight(1f),
                        onClick = { }
                    )
                }
            }
            
            // FAQs
            item {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Frequently Asked Questions",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
            }
            
            items(faqs.indices.toList()) { index ->
                FaqCard(
                    faq = faqs[index],
                    isExpanded = expandedFaq == index,
                    onClick = {
                        expandedFaq = if (expandedFaq == index) null else index
                    }
                )
            }
            
            item {
                Spacer(modifier = Modifier.height(16.dp))
            }
        }
    }
}

@Composable
private fun ContactOption(
    icon: String,
    title: String,
    subtitle: String,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(icon, fontSize = 28.sp)
        
        Spacer(modifier = Modifier.width(16.dp))
        
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                fontSize = 15.sp,
                fontWeight = FontWeight.Medium
            )
            Text(
                text = subtitle,
                fontSize = 13.sp,
                color = Color.Gray
            )
        }
        
        Text("→", fontSize = 18.sp, color = Color.Gray)
    }
}

@Composable
private fun QuickHelpCard(
    icon: String,
    title: String,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier.clickable { onClick() },
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(icon, fontSize = 32.sp)
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = title,
                fontSize = 13.sp,
                fontWeight = FontWeight.Medium
            )
        }
    }
}

@Composable
private fun FaqCard(
    faq: FaqItem,
    isExpanded: Boolean,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = faq.question,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier.weight(1f)
                )
                
                Text(
                    text = if (isExpanded) "▲" else "▼",
                    fontSize = 16.sp,
                    color = PrimaryOrange
                )
            }
            
            if (isExpanded) {
                Spacer(modifier = Modifier.height(12.dp))
                HorizontalDivider(color = Color.LightGray.copy(alpha = 0.5f))
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = faq.answer,
                    fontSize = 14.sp,
                    color = Color.DarkGray,
                    lineHeight = 20.sp
                )
            }
        }
    }
}
