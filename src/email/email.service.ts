import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

interface FlightDetails {
  booking_reference: string;
  source: string;
  destination: string;
  departure_time: string;
  return_flight?: {
    source: string;
    destination: string;
    departure_time: string;
  };
  cabin_class?: string;
  total_amount?: number;
  passengers_count?: number;
}

@Injectable()
export class EmailService {
  private transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    try {
      this.logger.log('Initializing email service');
      this.logger.log(`SMTP Host: ${process.env.SMTP_HOST}`);
      this.logger.log(`SMTP Port: ${process.env.SMTP_PORT}`);
      this.logger.log(`SMTP User: ${process.env.SMTP_USER}`);

      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      this.logger.log('Email service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize email service', error);
    }
  }

  async sendBookingConfirmation(email: string, flightDetails: FlightDetails) {
    try {
      this.logger.log(`Sending booking confirmation to ${email}`);

      const formattedDate = (dateStr: string) => {
        try {
          const date = new Date(dateStr);
          return date.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        } catch (e) {
          return dateStr;
        }
      };

      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount);
      };

      // Create HTML email template
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="background-color: #4a90e2; padding: 15px; text-align: center; border-radius: 5px 5px 0 0;">
            <h1 style="color: white; margin: 0;">Flight Booking Confirmation</h1>
          </div>
          
          <div style="padding: 20px;">
            <p style="font-size: 16px;">Dear Passenger,</p>
            <p style="font-size: 16px;">Your flight booking has been confirmed. Please find the details below:</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h2 style="color: #4a90e2; margin-top: 0;">Booking Reference: ${flightDetails.booking_reference}</h2>
              
              <h3 style="margin-bottom: 5px;">Outbound Flight</h3>
              <p>
                <strong>From:</strong> ${flightDetails.source}<br>
                <strong>To:</strong> ${flightDetails.destination}<br>
                <strong>Departure:</strong> ${formattedDate(flightDetails.departure_time)}<br>
                <strong>Cabin Class:</strong> ${flightDetails.cabin_class || 'Economy'}
              </p>
              
              ${
                flightDetails.return_flight
                  ? `
                <h3 style="margin-bottom: 5px; margin-top: 20px;">Return Flight</h3>
                <p>
                  <strong>From:</strong> ${flightDetails.return_flight.source}<br>
                  <strong>To:</strong> ${flightDetails.return_flight.destination}<br>
                  <strong>Departure:</strong> ${formattedDate(flightDetails.return_flight.departure_time)}<br>
                  <strong>Cabin Class:</strong> ${flightDetails.cabin_class || 'Economy'}
                </p>
              `
                  : ''
              }
              
              <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
                <p><strong>Passengers:</strong> ${flightDetails.passengers_count || 1}</p>
                <p><strong>Total Amount:</strong> ${formatCurrency(flightDetails.total_amount || 0)}</p>
              </div>
            </div>
            
            <p style="font-size: 16px;">Please arrive at the airport at least 2 hours before your scheduled departure time.</p>
            <p style="font-size: 16px;">Thank you for choosing our service!</p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 14px; color: #666; border-radius: 0 0 5px 5px;">
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      `;

      // Create plain text version as fallback
      const textContent = `
        FLIGHT BOOKING CONFIRMATION
        
        Dear Passenger,
        
        Your flight booking has been confirmed. Please find the details below:
        
        Booking Reference: ${flightDetails.booking_reference}
        
        OUTBOUND FLIGHT
        From: ${flightDetails.source}
        To: ${flightDetails.destination}
        Departure: ${formattedDate(flightDetails.departure_time)}
        Cabin Class: ${flightDetails.cabin_class || 'Economy'}
        
        ${
          flightDetails.return_flight
            ? `
        RETURN FLIGHT
        From: ${flightDetails.return_flight.source}
        To: ${flightDetails.return_flight.destination}
        Departure: ${formattedDate(flightDetails.return_flight.departure_time)}
        Cabin Class: ${flightDetails.cabin_class || 'Economy'}
        `
            : ''
        }
        
        Passengers: ${flightDetails.passengers_count || 1}
        Total Amount: ${formatCurrency(flightDetails.total_amount || 0)}
        
        Please arrive at the airport at least 2 hours before your scheduled departure time.
        
        Thank you for choosing our service!
        
        This is an automated email. Please do not reply to this message.
      `;

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: `Flight Booking Confirmation - ${flightDetails.booking_reference}`,
        text: textContent,
        html: htmlContent,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully to ${email}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to send booking confirmation email to ${email}`,
        error,
      );
      // Don't throw the error, just log it
      return { success: false, error: error.message };
    }
  }

  async sendFlightUpdate(email: string, flightStatus: string) {
    try {
      this.logger.log(`Sending flight update to ${email}`);

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Flight Status Update',
        text: `Your flight status has been updated to: ${flightStatus}`,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully to ${email}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to send flight update email to ${email}`,
        error,
      );
      // Don't throw the error, just log it
      return { success: false, error: error.message };
    }
  }
}
