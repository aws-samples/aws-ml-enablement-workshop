import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { analyticsClient } from '../api/client.js';
import { useAppStore } from '../stores/appStore.js';

export const ApplicationsPage = () => {
  const navigate = useNavigate();
  const setSelectedApplication = useAppStore(state => state.setSelectedApplication);

  const { data, isLoading, error } = useQuery({
    queryKey: ['applications'],
    queryFn: () => analyticsClient.getApplications(),
    refetchInterval: 30000, // 30秒ごとに更新
  });

  const handleApplicationSelect = (appId: string) => {
    setSelectedApplication(appId);
    navigate(`/dashboard?app=${appId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-red-50 border-red-200">
        <div className="text-center py-8">
          <p className="text-red-800 font-medium">アプリケーションの読み込みに失敗しました</p>
          <p className="text-red-600 text-sm mt-2">
            APIサーバーへの接続を確認してください
          </p>
        </div>
      </div>
    );
  }

  const applications = data?.applications || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">アプリケーション</h1>
        <p className="mt-2 text-gray-600">
          アナリティクス ダッシュボードを表示するアプリケーションを選択してください
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="card text-center py-12 bg-gray-50">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            まだデータがありません
          </h3>
          <p className="text-gray-600 mb-6">
            トラッキングSDKを使用してイベントを送信すると、<br />
            アプリケーションがここに表示されます。
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <div
              key={app.id}
              className="card hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-primary-200"
              onClick={() => handleApplicationSelect(app.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {app.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    ID: {app.id}
                  </p>
                </div>
                <div className="text-2xl">📊</div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">総イベント数:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {app.totalEvents.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">最終アクティビティ:</span>
                  <span className="text-sm text-gray-700">
                    {app.lastActivity > 0 
                      ? formatDistanceToNow(app.lastActivity, { addSuffix: true })
                      : 'なし'
                    }
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-primary-600 font-medium">
                  ダッシュボードを表示 →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
