package com.example.carryon.ui.screens.booking

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.carryon.ui.theme.*

@Composable
fun BookingConfirmedScreen(
    bookingId: String,
    pickupAddress: String = "Jl. Sudirman 42",
    deliveryAddress: String = "Jl. Gatot Subroto 12",
    vehicle: String = "Mini Truck",
    paymentMethod: String = "COD",
    totalAmount: Int = 150,
    onTrackOrder: () -> Unit,
    onGoHome: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            .padding(horizontal = 28.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(72.dp))

        // ── SUCCESS CIRCLE ──
        Box(
            modifier = Modifier
                .size(110.dp)
                .background(PrimaryBlueSurface, CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .background(PrimaryBlue, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Text("✓", fontSize = 36.sp, color = Color.White, fontWeight = FontWeight.Bold)
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            "Thank you",
            fontSize = 26.sp,
            fontWeight = FontWeight.Bold,
            color = TextPrimary
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            "Your booking has been successfully\nconfirmed. We will be sending you\nan email with all the details.",
            fontSize = 14.sp,
            color = TextSecondary,
            textAlign = TextAlign.Center,
            lineHeight = 22.sp
        )

        Spacer(modifier = Modifier.height(32.dp))

        // ── BOOKING ID CHIP ──
        Surface(
            shape = RoundedCornerShape(50.dp),
            color = PrimaryBlueSurface
        ) {
            Text(
                "Booking ID: $bookingId",
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold,
                color = PrimaryBlueDark,
                modifier = Modifier.padding(horizontal = 18.dp, vertical = 8.dp)
            )
        }

        Spacer(modifier = Modifier.height(32.dp))

        // ── ORDER DETAILS CARD ──
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFFF8FAFF)),
            elevation = CardDefaults.cardElevation(2.dp)
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text("Order Details", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                Spacer(modifier = Modifier.height(14.dp))

                ConfirmDetailRow(icon = "📍", label = "Pickup", value = pickupAddress)
                Spacer(modifier = Modifier.height(10.dp))
                ConfirmDetailRow(icon = "🏠", label = "Destination", value = deliveryAddress)
                Spacer(modifier = Modifier.height(10.dp))
                ConfirmDetailRow(icon = "🚛", label = "Vehicle", value = vehicle)
                Spacer(modifier = Modifier.height(10.dp))
                ConfirmDetailRow(icon = "💳", label = "Payment", value = paymentMethod)
                Divider(modifier = Modifier.padding(vertical = 12.dp), color = Color(0xFFE8EAF6))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Total", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                    Text("₹$totalAmount", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = PrimaryBlue)
                }
            }
        }

        Spacer(modifier = Modifier.weight(1f))

        // ── BUTTONS ──
        Button(
            onClick = onTrackOrder,
            modifier = Modifier
                .fillMaxWidth()
                .height(54.dp),
            shape = RoundedCornerShape(14.dp),
            colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue)
        ) {
            Text("Track My Order", fontSize = 16.sp, fontWeight = FontWeight.SemiBold, color = Color.White)
        }

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedButton(
            onClick = onGoHome,
            modifier = Modifier
                .fillMaxWidth()
                .height(54.dp),
            shape = RoundedCornerShape(14.dp),
            border = ButtonDefaults.outlinedButtonBorder.copy(
                width = 1.5.dp
            ),
            colors = ButtonDefaults.outlinedButtonColors(contentColor = PrimaryBlue)
        ) {
            Text("Go to Home", fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
        }

        Spacer(modifier = Modifier.height(36.dp))
    }
}

@Composable
private fun ConfirmDetailRow(icon: String, label: String, value: String) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Text(icon, fontSize = 18.sp)
        Spacer(modifier = Modifier.width(10.dp))
        Column {
            Text(label, fontSize = 11.sp, color = TextSecondary)
            Text(value, fontSize = 13.sp, fontWeight = FontWeight.Medium, color = TextPrimary)
        }
    }
}
