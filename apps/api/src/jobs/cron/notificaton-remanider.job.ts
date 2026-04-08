// External packages
import { createElement } from "react";
import cron from "node-cron";

// Models
import { retrieveAllUnreadNotificationsFromUsers } from "@/models/notification.model";

// Config
import { resend } from "@/lib/config/resend";

// Transactional emails
import { Notification } from "@repo/transactional/notification";

// Svaka 24 sata se pokreće cron job koji prolazi kroz sve notifikacije korisnika i šalje na mail podsjetnik o nepročitanim notifikacijama. Ovo pomaže korisnicima da ostanu informisani o aktivnostima na platformi i da ne propuste važne događaje ili interakcije vezane za njihove postove, komentare ili organizacije koje prate.
cron.schedule("0 0 */24 * * *", async () => {
  const usersWithUnreadNotifications =
    await retrieveAllUnreadNotificationsFromUsers({
      timeInterval: 24,
    });

  const usersForReminder = usersWithUnreadNotifications.filter(
    (user) => user.notifications.length > 5,
  );

  await Promise.all(
    usersForReminder.map(async (user) => {
      await resend.emails.send({
        from: process.env.RESEND_FROM!,
        to: user.email,
        subject: "You have unread notifications",
        react: createElement(Notification, {
          firstName: user.firstName,
          notificationsCount: user.notifications.length,
        }),
      });
    }),
  );
});

// Iz dokumentacije node-crona što znači koji izraz (*)

//  # ┌────────────── second (optional)
//  # │ ┌──────────── minute
//  # │ │ ┌────────── hour
//  # │ │ │ ┌──────── day of month
//  # │ │ │ │ ┌────── month
//  # │ │ │ │ │ ┌──── day of week
//  # │ │ │ │ │ │
//  # │ │ │ │ │ │
//  # * * * * * *
