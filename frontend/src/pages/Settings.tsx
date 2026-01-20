export default function Settings() {
  const settingsSections = [
    {
      title: "계정 설정",
      items: [
        { label: "프로필 수정", icon: "👤" },
        { label: "비밀번호 변경", icon: "🔒" },
        { label: "이메일 변경", icon: "📧" },
      ],
    },
    {
      title: "알림 설정",
      items: [
        { label: "푸시 알림", icon: "🔔" },
        { label: "이메일 알림", icon: "📨" },
        { label: "좋아요 알림", icon: "❤️" },
      ],
    },
    {
      title: "개인정보 및 보안",
      items: [
        { label: "개인정보 처리방침", icon: "📜" },
        { label: "차단한 사용자", icon: "🚫" },
        { label: "로그인 기록", icon: "📋" },
      ],
    },
  ];

  return (
    <section className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">설정</h1>
          <p className="mt-1 text-sm text-gray-600 md:text-base">
            계정 및 설정을 관리하세요
          </p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4 md:space-y-6">
        {settingsSections.map((section, idx) => (
          <div
            key={idx}
            className="overflow-hidden rounded-lg bg-white shadow-md md:rounded-xl"
          >
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 md:px-6 md:py-4">
              <h2 className="text-base font-semibold text-gray-900 md:text-lg">
                {section.title}
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {section.items.map((item, itemIdx) => (
                <button
                  key={itemIdx}
                  className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50 md:px-6 md:py-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl md:text-2xl">{item.icon}</span>
                    <span className="text-sm font-medium text-gray-700 md:text-base">
                      {item.label}
                    </span>
                  </div>
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="overflow-hidden rounded-lg border border-red-200 bg-white shadow-md md:rounded-xl">
        <div className="border-b border-red-200 bg-red-50 px-4 py-3 md:px-6 md:py-4">
          <h2 className="text-base font-semibold text-red-900 md:text-lg">
            위험 지역
          </h2>
        </div>
        <div className="p-4 md:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900 md:text-base">
                계정 삭제
              </h3>
              <p className="mt-1 text-xs text-gray-600 md:text-sm">
                계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
              </p>
            </div>
            <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-red-700 active:bg-red-800 md:px-5 md:py-2.5 md:text-base">
              계정 삭제
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
