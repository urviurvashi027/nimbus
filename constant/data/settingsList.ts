// Account Setting::

// Notification - Morning Check-in, nightly review, log your mood, streak save
// Routine Setting - sorting, week start on, move completed task down,
// sound effect

// Help and feedback::
// help center - Faq
// feedback  -- modal -- input box, button
// privacy policy -- modal, privacyPolicy
// term of servcie -- modal, term of service

// social media ::
// discord group -- link, details
// instgram -- link, details
// facebbok -- link, details

export const Section: any[] = [
  {
    header: "Perference",
    icon: "settings",
    items: [
      {
        id: "notification",
        icon: "notifications-outline",
        color: "#dfd9f9",
        type: "modal",
        label: "Notification",
      },
      {
        id: "advanceSetting",
        icon: "construct-outline",
        color: "#dfd9f9",
        type: "modal",
        label: "Advance Setting",
      },
      {
        id: "soundEffect",
        icon: "musical-notes-outline",
        color: "#dfd9f9",
        type: "toogle",
        label: "Sound Effect",
      },
      {
        id: "navigation",
        icon: "navigate",
        color: "#dfd9f9",
        type: "link",
        label: "Location",
      },
    ],
  },
  {
    header: "Account",
    icon: "document",
    items: [
      {
        id: "edit",
        icon: "people",

        color: "#dfd9f9",
        type: "modal",
        label: "Profile Info",
      },
      {
        id: "chngPass",
        icon: "build-outline",
        color: "#dfd9f9",
        type: "modal",
        label: "Change Password",
      },
      {
        id: "logout",
        icon: "exit-outline",
        color: "#dfd9f9",
        type: "modal",
        label: "Logout",
      },
    ],
  },
  {
    header: "Help and feedback",
    icon: "help-circle",
    items: [
      {
        id: "helpCenter",
        icon: "help",
        color: "#dfd9f9",
        type: "modal",
        label: "Help Center",
      },
      {
        id: "bug",
        icon: "bug-outline",
        color: "#dfd9f9",
        type: "modal",
        label: "Report Bug",
      },
      {
        id: "feedback",
        icon: "mail",
        color: "#dfd9f9",
        type: "modal",
        label: "Feedback",
      },
      {
        id: "privacyPolicy",
        icon: "contract",
        color: "#dfd9f9",
        type: "modal",
        label: "Privacy Policy",
      },
      {
        id: "terms",
        icon: "document-outline",
        color: "#dfd9f9",
        type: "modal",
        label: "Terms and Services",
      },
    ],
  },
  {
    header: "Social Media",
    icon: "document",
    items: [
      {
        id: "discord",
        icon: "logo-discord",
        color: "#dfd9f9",
        type: "modal",
        label: "Discord",
      },
      {
        id: "instagram",
        icon: "logo-instagram",
        color: "#dfd9f9",
        type: "modal",
        label: "Instagram",
      },
      {
        id: "facebook",
        icon: "logo-facebook",
        color: "#dfd9f9",
        type: "modal",
        label: "Facebook",
      },
    ],
  },
];
