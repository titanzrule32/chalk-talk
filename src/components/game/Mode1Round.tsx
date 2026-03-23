import { useState, useMemo, useCallback } from 'react';
import { getMode1ById } from '../../data';
import { shuffle, pickRandom } from '../../utils/shuffle';
import { TeamLogo } from './TeamLogo';
import { ClueBar } from './ClueBar';
import { AnswerButton } from './AnswerButton';
import { FeedbackOverlay } from './FeedbackOverlay';
import { ScoreBar } from './ScoreBar';
import { scoreMode1City, scoreMode1Team } from '../../utils/scoring';

interface Mode1RoundProps {
  questionIds: string[];
  questionIndex: number;
  score: number;
  streak: number;
  onQuestionComplete: (cityAttempts: number, cityCorrect: boolean, teamCorrect: boolean) => void;
  onNextQuestion: () => void;
}

type Phase = 'pick-city' | 'city-feedback' | 'pick-team' | 'team-feedback';

export function Mode1Round({
  questionIds,
  questionIndex,
  score,
  streak,
  onQuestionComplete,
  onNextQuestion,
}: Mode1RoundProps) {
  const [phase, setPhase] = useState<Phase>('pick-city');
  const [cityAttempts, setCityAttempts] = useState(0);
  const [cityCorrect, setCityCorrect] = useState(false);
  const [lastTeamCorrect, setLastTeamCorrect] = useState<boolean | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const questionId = questionIds[questionIndex]!;
  const question = getMode1ById(questionId);

  const cityOptions = useMemo(() => {
    if (!question) return [];
    const distractors = pickRandom(question.distractors.cities, 3);
    return shuffle([question.city, ...distractors]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  const teamOptions = useMemo(() => {
    if (!question) return [];
    const distractors = pickRandom(question.distractors.teams, 3);
    return shuffle([question.team_name, ...distractors]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  const clues = useMemo(() => {
    if (!question) return [];
    return [
      `This team plays in the ${question.league}`,
      `They play in the ${question.division}`,
      `This is where ${question.star_players[0] ?? 'a star player'} plays`,
    ];
  }, [question]);

  const resetForNewQuestion = useCallback(() => {
    setPhase('pick-city');
    setCityAttempts(0);
    setCityCorrect(false);
    setLastTeamCorrect(null);
    setSelectedCity(null);
    setSelectedTeam(null);
    setIsProcessing(false);
    onNextQuestion();
  }, [onNextQuestion]);

  if (!question) return <div>Question not found</div>;

  const handleCityAnswer = (answer: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setSelectedCity(answer);
    const correct = answer === question.city;
    const newAttempts = cityAttempts + 1;
    setCityAttempts(newAttempts);

    if (correct) {
      setCityCorrect(true);
      setTimeout(() => {
        setPhase('pick-team');
        setSelectedCity(null);
        setIsProcessing(false);
      }, 800);
    } else {
      if (newAttempts >= 3) {
        setTimeout(() => {
          setPhase('city-feedback');
        }, 600);
      } else {
        setTimeout(() => {
          setSelectedCity(null);
          setIsProcessing(false);
        }, 600);
      }
    }
  };

  const handleTeamAnswer = (answer: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setSelectedTeam(answer);
    const correct = answer === question.team_name;
    setLastTeamCorrect(correct);

    // Report to engine with accumulated city state
    onQuestionComplete(cityAttempts, cityCorrect, correct);

    setTimeout(() => {
      setPhase('team-feedback');
    }, 600);
  };

  const getCityButtonState = (option: string) => {
    if (!selectedCity || selectedCity !== option) return 'default' as const;
    if (option === question.city) return 'correct' as const;
    return 'wrong' as const;
  };

  const getTeamButtonState = (option: string) => {
    if (!selectedTeam) return 'default' as const;
    if (option === question.team_name) return 'correct' as const;
    if (selectedTeam === option) return 'wrong' as const;
    return 'default' as const;
  };

  const cityPoints = scoreMode1City(cityAttempts, cityCorrect);
  const teamPoints = lastTeamCorrect !== null ? scoreMode1Team(lastTeamCorrect) : 0;

  return (
    <div className="flex flex-1 flex-col">
      <ScoreBar
        score={score}
        questionIndex={questionIndex}
        totalQuestions={questionIds.length}
        streak={streak}
      />

      <div className="mb-4 flex justify-center">
        <TeamLogo src={question.logo_url} alt="Team Logo" />
      </div>

      {phase === 'pick-city' && (
        <>
          <ClueBar clues={clues} revealedCount={cityAttempts} />
          <p className="mb-3 text-center text-xl font-bold text-chalk-text">
            Which city is this team from?
          </p>
          <div className="flex flex-col gap-2">
            {cityOptions.map((option) => (
              <AnswerButton
                key={option}
                label={option}
                onClick={() => handleCityAnswer(option)}
                disabled={isProcessing}
                state={getCityButtonState(option)}
              />
            ))}
          </div>
        </>
      )}

      {phase === 'city-feedback' && (
        <FeedbackOverlay
          correct={false}
          message={`The answer was ${question.city}, ${question.state}`}
          onComplete={() => {
            setPhase('pick-team');
            setIsProcessing(false);
          }}
        />
      )}

      {phase === 'pick-team' && (
        <>
          <div className="mb-3 rounded-xl bg-blue-50 px-4 py-2 text-center text-sm font-semibold text-blue-800">
            {cityCorrect
              ? `Correct! This team is from ${question.city}.`
              : `This team is from ${question.city}, ${question.state}.`}
          </div>
          <p className="mb-3 text-center text-xl font-bold text-chalk-text">
            What is the team's name?
          </p>
          <div className="flex flex-col gap-2">
            {teamOptions.map((option) => (
              <AnswerButton
                key={option}
                label={option}
                onClick={() => handleTeamAnswer(option)}
                disabled={isProcessing}
                state={getTeamButtonState(option)}
              />
            ))}
          </div>
        </>
      )}

      {phase === 'team-feedback' && (
        <FeedbackOverlay
          correct={lastTeamCorrect ?? false}
          message={
            lastTeamCorrect
              ? `+${cityPoints + teamPoints} points!`
              : `It's the ${question.team_name}! +${cityPoints} points.`
          }
          onComplete={resetForNewQuestion}
        />
      )}
    </div>
  );
}
