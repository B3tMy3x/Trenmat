"""fix

Revision ID: 60827782816a
Revises: 78c7a372e851
Create Date: 2024-12-03 13:47:01.327924

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '60827782816a'
down_revision: Union[str, None] = '78c7a372e851'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('results', sa.Column('student_id', sa.BigInteger(), nullable=False))
    op.drop_column('results', 'test_name')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('results', sa.Column('test_name', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.drop_column('results', 'student_id')
    # ### end Alembic commands ###