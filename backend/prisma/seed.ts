import * as path from 'path';

import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

import { PrismaClient } from '../src/generated/prisma/client';

// 환경 변수 로드: NODE_ENV에 맞는 파일(.env.development, .env.test 등)을 우선 로드
const envFileName = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
const envPath = path.resolve(__dirname, '..', envFileName);
dotenv.config({ path: envPath });
// 만약 특정 NODE_ENV 파일에서 DATABASE_URL을 못 읽었다면 기본 .env를 시도
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function main() {
  console.log('🌱 데이터베이스 시딩 시작...');

  await prisma.rate.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.board.deleteMany();
  await prisma.user.deleteMany();

  // 사용자 생성
  console.log('👤 사용자 생성 중...');
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'qwe@a.com',
        name: '홍길동',
        passwordHashed: await hashPassword('123'),
      },
    }),
    prisma.user.create({
      data: {
        email: 'user1@example.com',
        name: '김철수',
        passwordHashed: await hashPassword('password123'),
      },
    }),
    prisma.user.create({
      data: {
        email: 'user2@example.com',
        name: '이영희',
        passwordHashed: await hashPassword('password123'),
      },
    }),
    prisma.user.create({
      data: {
        email: 'user3@example.com',
        name: '박민수',
        passwordHashed: await hashPassword('password123'),
      },
    }),
    prisma.user.create({
      data: {
        email: 'user4@example.com',
        name: '최지현',
        passwordHashed: await hashPassword('password123'),
      },
    }),
    prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: '관리자',
        passwordHashed: await hashPassword('admin123'),
      },
    }),
    // 추가 샘플 사용자들
    prisma.user.create({
      data: {
        email: 'user5@example.com',
        name: '강민호',
        passwordHashed: await hashPassword('password123'),
      },
    }),
    prisma.user.create({
      data: {
        email: 'user6@example.com',
        name: '한수진',
        passwordHashed: await hashPassword('password123'),
      },
    }),
    prisma.user.create({
      data: {
        email: 'user7@example.com',
        name: '정우성',
        passwordHashed: await hashPassword('password123'),
      },
    }),
    prisma.user.create({
      data: {
        email: 'user8@example.com',
        name: '오민아',
        passwordHashed: await hashPassword('password123'),
      },
    }),
    prisma.user.create({
      data: {
        email: 'user9@example.com',
        name: '백준호',
        passwordHashed: await hashPassword('password123'),
      },
    }),
    prisma.user.create({
      data: {
        email: 'user10@example.com',
        name: '윤서현',
        passwordHashed: await hashPassword('password123'),
      },
    }),
    prisma.user.create({
      data: {
        email: 'user11@example.com',
        name: '이강인',
        passwordHashed: await hashPassword('password123'),
      },
    }),
    prisma.user.create({
      data: {
        email: 'user12@example.com',
        name: '최민규',
        passwordHashed: await hashPassword('password123'),
      },
    }),
    prisma.user.create({
      data: {
        email: 'user13@example.com',
        name: '박지수',
        passwordHashed: await hashPassword('password123'),
      },
    }),
    prisma.user.create({
      data: {
        email: 'user14@example.com',
        name: '김하늘',
        passwordHashed: await hashPassword('password123'),
      },
    }),
  ]);

  console.log(`✅ ${users.length}명의 사용자 생성 완료`);

  // 팔로우 관계 생성
  console.log('🤝 팔로우 관계 생성 중...');
  await Promise.all([
    prisma.follow.create({
      data: {
        followerId: users[0].id,
        followingId: users[1].id,
      },
    }),
    prisma.follow.create({
      data: {
        followerId: users[0].id,
        followingId: users[2].id,
      },
    }),
    prisma.follow.create({
      data: {
        followerId: users[1].id,
        followingId: users[0].id,
      },
    }),
    prisma.follow.create({
      data: {
        followerId: users[2].id,
        followingId: users[0].id,
      },
    }),
    prisma.follow.create({
      data: {
        followerId: users[3].id,
        followingId: users[0].id,
      },
    }),
  ]);

  console.log('✅ 팔로우 관계 생성 완료');

  // 게시판 생성
  console.log('📋 게시판 생성 중...');
  const boards = await Promise.all([
    prisma.board.create({
      data: {
        name: '자유게시판',
        description: '자유롭게 이야기를 나누는 공간입니다',
      },
    }),
    prisma.board.create({
      data: {
        name: '공지사항',
        description: '중요한 공지사항을 확인하세요',
      },
    }),
    prisma.board.create({
      data: {
        name: '기술',
        description: '개발 및 기술 관련 이야기',
      },
    }),
    prisma.board.create({
      data: {
        name: '일상',
        description: '일상 이야기를 공유하는 게시판',
      },
    }),
  ]);

  console.log(`✅ ${boards.length}개의 게시판 생성 완료`);

  // 게시글 생성
  console.log('📝 게시글 생성 중...');
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: 'Marvel Outside에 오신 것을 환영합니다!',
        content:
          '# 환영합니다!\n\n새로운 커뮤니티 플랫폼 Marvel Outside가 오픈했습니다.\n\n다양한 이야기를 자유롭게 나누어 보세요!',
        authorId: users[4].id,
        boardId: boards[1].id,
        hits: 45,
        publishedAt: new Date(),
      },
    }),
    prisma.post.create({
      data: {
        title: '첫 번째 게시글',
        content:
          '안녕하세요! 첫 게시글을 작성해봅니다.\n\nMarkdown 형식으로 작성할 수 있어서 편리하네요.',
        authorId: users[0].id,
        boardId: boards[0].id,
        hits: 23,
        publishedAt: new Date(),
      },
    }),
    prisma.post.create({
      data: {
        title: 'React 19 새로운 기능 소개',
        content:
          '# React 19의 주요 변경사항\n\n## 1. 자동 JSX 런타임\n- 더 이상 React를 import할 필요가 없습니다.\n\n## 2. 성능 개선\n- 렌더링 성능이 대폭 향상되었습니다.',

        authorId: users[1].id,
        boardId: boards[2].id,
        hits: 67,
        publishedAt: new Date(),
      },
    }),
    prisma.post.create({
      data: {
        title: '오늘의 일상',
        content: '오늘 날씨가 정말 좋네요! 산책하기 딱 좋은 날입니다.',

        authorId: users[0].id,
        boardId: boards[3].id,
        hits: 15,
        publishedAt: new Date(),
      },
    }),
    prisma.post.create({
      data: {
        title: 'Tailwind CSS v4 사용 후기',
        content:
          '# Tailwind CSS v4\n\nVite 플러그인을 사용하면 설정이 정말 간단합니다!\n\n유틸리티 클래스로 빠르게 UI를 구성할 수 있어서 생산성이 높아졌어요.',

        authorId: users[2].id,
        boardId: boards[2].id,
        publishedAt: new Date(),
        hits: 42,
      },
    }),
    prisma.post.create({
      data: {
        title: 'NestJS로 백엔드 개발하기',
        content:
          '# NestJS 소개\n\nTypeScript 기반의 Node.js 프레임워크입니다.\n\n## 장점\n- 강력한 타입 시스템\n- 모듈화된 구조\n- 다양한 내장 기능',

        authorId: users[3].id,
        boardId: boards[2].id,
        hits: 38,
        publishedAt: new Date(),
      },
    }),
    prisma.post.create({
      data: {
        title: '새로운 프로젝트 시작',
        content: '드디어 새로운 프로젝트를 시작했습니다. 열심히 해보겠습니다!',

        authorId: users[1].id,
        boardId: boards[3].id,
        hits: 18,
        publishedAt: new Date(),
      },
    }),
    prisma.post.create({
      data: {
        title: 'Docker로 개발 환경 구성하기',
        content:
          '# Docker 개발 환경\n\n```bash\ndocker compose up --build\n```\n\n위 명령어로 간단하게 전체 환경을 구성할 수 있습니다.',

        authorId: users[0].id,
        boardId: boards[2].id,
        hits: 52,
        publishedAt: new Date(),
      },
    }),
    // 추가 게시글
    prisma.post.create({
      data: {
        title: '시드 추가 게시글 1',
        content: '샘플 게시글 내용 1',
        authorId: users[5].id,
        boardId: boards[0].id,
        hits: 3,
        publishedAt: new Date(),
      },
    }),
    prisma.post.create({
      data: {
        title: '시드 추가 게시글 2',
        content: '샘플 게시글 내용 2',
        authorId: users[6].id,
        boardId: boards[2].id,
        hits: 7,
        publishedAt: new Date(),
      },
    }),
    prisma.post.create({
      data: {
        title: '시드 추가 게시글 3',
        content: '샘플 게시글 내용 3',
        authorId: users[7].id,
        boardId: boards[1].id,
        hits: 1,
        publishedAt: new Date(),
      },
    }),
    prisma.post.create({
      data: {
        title: '시드 추가 게시글 4',
        content: '샘플 게시글 내용 4',
        authorId: users[8].id,
        boardId: boards[3].id,
        hits: 2,
        publishedAt: new Date(),
      },
    }),
    prisma.post.create({
      data: {
        title: '시드 추가 게시글 5',
        content: '샘플 게시글 내용 5',
        authorId: users[9].id,
        boardId: boards[0].id,
        hits: 5,
        publishedAt: new Date(),
      },
    }),
    prisma.post.create({
      data: {
        title: '시드 추가 게시글 6',
        content: '샘플 게시글 내용 6',
        authorId: users[10].id,
        boardId: boards[2].id,
        hits: 4,
        publishedAt: new Date(),
      },
    }),
  ]);

  console.log(`✅ ${posts.length}개의 게시글 생성 완료`);

  // 좋아요/싫어요 생성
  console.log('👍 좋아요/싫어요 생성 중...');
  await Promise.all([
    // 첫 번째 게시글에 좋아요
    prisma.rate.create({
      data: {
        userId: users[1].id,
        postId: posts[0].id,
        isLike: true,
      },
    }),
    prisma.rate.create({
      data: {
        userId: users[2].id,
        postId: posts[0].id,
        isLike: true,
      },
    }),
    prisma.rate.create({
      data: {
        userId: users[3].id,
        postId: posts[0].id,
        isLike: true,
      },
    }),
    // React 19 게시글에 좋아요
    prisma.rate.create({
      data: {
        userId: users[0].id,
        postId: posts[2].id,
        isLike: true,
      },
    }),
    prisma.rate.create({
      data: {
        userId: users[2].id,
        postId: posts[2].id,
        isLike: true,
      },
    }),
    // Tailwind CSS 게시글에 좋아요
    prisma.rate.create({
      data: {
        userId: users[0].id,
        postId: posts[4].id,
        isLike: true,
      },
    }),
    prisma.rate.create({
      data: {
        userId: users[1].id,
        postId: posts[4].id,
        isLike: true,
      },
    }),
    // 일부 싫어요
    prisma.rate.create({
      data: {
        userId: users[3].id,
        postId: posts[3].id,
        isLike: false,
      },
    }),
  ]);

  console.log('✅ 좋아요/싫어요 생성 완료');

  // 댓글 생성 (샘플)
  console.log('💬 댓글 생성 중...');
  await Promise.all([
    prisma.comment.create({
      data: { content: '좋은 글이네요!', authorId: users[1].id, postId: posts[0].id },
    }),
    prisma.comment.create({
      data: { content: '도움 되었습니다.', authorId: users[5].id, postId: posts[0].id },
    }),
    prisma.comment.create({
      data: { content: '감사합니다!', authorId: users[6].id, postId: posts[1].id },
    }),
    prisma.comment.create({
      data: { content: '공유 감사해요.', authorId: users[7].id, postId: posts[2].id },
    }),
    prisma.comment.create({
      data: { content: '잘 읽었습니다.', authorId: users[8].id, postId: posts[3].id },
    }),
    prisma.comment.create({
      data: { content: '재밌네요', authorId: users[9].id, postId: posts[4].id },
    }),
    prisma.comment.create({
      data: { content: '참고하겠습니다.', authorId: users[10].id, postId: posts[5].id },
    }),
    prisma.comment.create({
      data: { content: '정말 유용해요.', authorId: users[11].id, postId: posts[6].id },
    }),
    prisma.comment.create({
      data: { content: '좋아요!', authorId: users[12].id, postId: posts[7].id },
    }),
    prisma.comment.create({
      data: { content: '다음 글도 기대할게요.', authorId: users[13].id, postId: posts[8].id },
    }),
    prisma.comment.create({
      data: { content: '잘 정리되어 있네요.', authorId: users[5].id, postId: posts[9].id },
    }),
    prisma.comment.create({
      data: { content: '감사합니다 좋은 정보!', authorId: users[6].id, postId: posts[10].id },
    }),
  ]);

  console.log('✅ 댓글 생성 완료');

  console.log('\n🎉 데이터베이스 시딩 완료!');
  console.log('\n📊 생성된 데이터:');
  console.log(`  - 사용자: ${users.length}명`);
  console.log(`  - 게시판: ${boards.length}개`);
  console.log(`  - 게시글: ${posts.length}개`);
  console.log(`  - 팔로우: 5개`);
  console.log(`  - 좋아요/싫어요: 8개`);
  console.log('\n💡 테스트 계정:');
  console.log('  - user1@example.com / password123');
  console.log('  - admin@example.com / admin123');
}

main()
  .catch(e => {
    console.error('❌ 시딩 오류:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
